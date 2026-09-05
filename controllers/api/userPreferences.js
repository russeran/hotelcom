const UserPreferences = require('../../models/userPreferences');

async function getPreferences(req, res) {
    const prefs = await UserPreferences.findOne({ userId: req.user._id });
    if (!prefs) {
        // Return default preferences
        return res.json({
            dashboardLayout: { cards: getDefaultCards(req.user) },
            theme: 'dark',
            notifications: { email: true, push: true, sms: false }
        });
    }
    res.json(prefs);
}

async function updatePreferences(req, res) {
    const { dashboardLayout, theme, notifications } = req.body;
    
    let prefs = await UserPreferences.findOne({ userId: req.user._id });
    
    if (prefs) {
        if (dashboardLayout) prefs.dashboardLayout = dashboardLayout;
        if (theme) prefs.theme = theme;
        if (notifications) prefs.notifications = { ...prefs.notifications, ...notifications };
        await prefs.save();
    } else {
        prefs = await UserPreferences.create({
            userId: req.user._id,
            dashboardLayout,
            theme,
            notifications
        });
    }
    
    res.json(prefs);
}

async function resetDashboard(req, res) {
    const defaultCards = getDefaultCards(req.user);
    
    let prefs = await UserPreferences.findOne({ userId: req.user._id });
    if (prefs) {
        prefs.dashboardLayout = { cards: defaultCards };
        await prefs.save();
    } else {
        prefs = await UserPreferences.create({
            userId: req.user._id,
            dashboardLayout: { cards: defaultCards }
        });
    }
    
    res.json(prefs);
}

function getDefaultCards(user) {
    const baseCards = [
        { id: 'clock', type: 'clock', title: 'Current Time', position: 0, visible: true, size: 'small' },
        { id: 'weather', type: 'weather', title: 'Weather', position: 1, visible: true, size: 'small' },
        { id: 'tasks', type: 'count', title: 'My Tasks', position: 2, visible: true, size: 'medium' },
        { id: 'guest-request', type: 'form', title: 'Log Guest Request', position: 3, visible: true, size: 'large' }
    ];
    
    // Add role/department specific cards
    const roleCards = [];
    
    if (user.department === 'Front Desk' || user.role === 'manager' || user.role === 'admin') {
        roleCards.push(
            { id: 'reservations', type: 'count', title: 'Reservations', position: 4, visible: true, size: 'medium' },
            { id: 'rooms', type: 'count', title: 'Rooms', position: 5, visible: true, size: 'medium' },
            { id: 'complaints', type: 'count', title: 'Complaints', position: 6, visible: true, size: 'medium' }
        );
    }
    
    if (user.department === 'Food & Beverage' || user.role === 'manager' || user.role === 'admin') {
        roleCards.push(
            { id: 'restaurants', type: 'count', title: 'Restaurants', position: 7, visible: true, size: 'medium' },
            { id: 'waitlist', type: 'count', title: 'Waitlist', position: 8, visible: true, size: 'medium' }
        );
    }
    
    if (user.department === 'Concierge' || user.role === 'manager' || user.role === 'admin') {
        roleCards.push(
            { id: 'concierge', type: 'count', title: 'Concierge Items', position: 9, visible: true, size: 'medium' },
            { id: 'packages', type: 'count', title: 'Packages', position: 10, visible: true, size: 'medium' }
        );
    }
    
    if (user.department === 'Housekeeping' || user.role === 'manager' || user.role === 'admin') {
        roleCards.push(
            { id: 'lost-found', type: 'count', title: 'Lost & Found', position: 11, visible: true, size: 'medium' }
        );
    }
    
    roleCards.push(
        { id: 'notes', type: 'count', title: 'Notes', position: 12, visible: true, size: 'medium' }
    );
    
    return [...baseCards, ...roleCards];
}

module.exports = {
    getPreferences,
    updatePreferences,
    resetDashboard
};
