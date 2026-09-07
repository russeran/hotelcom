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
    // Default cards that match frontend renderCard cases
    const defaultCards = [
        { id: 'tasks', type: 'stat', title: 'Open Tasks', position: 0, visible: true, size: 'medium' },
        { id: 'complaints', type: 'stat', title: 'Complaints', position: 1, visible: true, size: 'medium' },
        { id: 'arrivals', type: 'stat', title: 'Arrivals Today', position: 2, visible: true, size: 'medium' },
        { id: 'occupied', type: 'stat', title: 'Occupied Rooms', position: 3, visible: true, size: 'medium' },
        { id: 'to-clean', type: 'stat', title: 'To Clean', position: 4, visible: true, size: 'medium' },
        { id: 'notifications', type: 'stat', title: 'Notifications', position: 5, visible: true, size: 'medium' },
        { id: 'messages', type: 'stat', title: 'Messages', position: 6, visible: true, size: 'medium' },
        { id: 'concierge', type: 'stat', title: 'Concierge', position: 7, visible: true, size: 'medium' },
        { id: 'recent-alerts', type: 'list', title: 'Recent Alerts', position: 8, visible: true, size: 'large' },
        { id: 'latest-chat', type: 'list', title: 'Latest Chat', position: 9, visible: true, size: 'large' }
    ];
    
    return defaultCards;
}

module.exports = {
    getPreferences,
    updatePreferences,
    resetDashboard
};
