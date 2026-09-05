import { useEffect, useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import './Home.css';
import 'react-grid-layout/css/styles.css';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import StatCard from '../../components/StatCard/StatCard';
import * as tasksAPI from '../../utilities/tasks-api';
import * as complaintsAPI from '../../utilities/complaints-api';
import * as notesAPI from '../../utilities/notes-api';
import * as conciergesAPI from '../../utilities/concierges-api';
import * as notificationsAPI from '../../utilities/notifications-api';
import * as messagesAPI from '../../utilities/messages-api';
import * as roomsAPI from '../../utilities/rooms-api';
import * as reservationsAPI from '../../utilities/reservations-api';
import * as userPreferencesAPI from '../../utilities/userPreferences-api';

const ResponsiveGridLayout = WidthProvider(Responsive);

const CLOSED = ['done', 'resolved', 'complete', 'completed', 'closed', 'cancelled'];
const isOpen = (status) => !CLOSED.includes((status || '').toString().trim().toLowerCase());
const isToday = (d) => {
    if (!d) return false;
    const x = new Date(d); const t = new Date();
    return x.getFullYear() === t.getFullYear() && x.getMonth() === t.getMonth() && x.getDate() === t.getDate();
};

export default function Home({ user, setUser }) {
    const [stats, setStats] = useState({ tasks: [], complaints: [], notes: [], concierges: [], notifications: [], messages: [], rooms: [], reservations: [] });
    const [loading, setLoading] = useState(true);
    const [customizeMode, setCustomizeMode] = useState(false);
    const [layout, setLayout] = useState([]);

    const loadData = useCallback(async () => {
        const [tasks, complaints, notes, concierges, notifications, messages, rooms, reservations] = await Promise.all([
            tasksAPI.getAllTasks().catch(() => []),
            complaintsAPI.getAllComplaints().catch(() => []),
            notesAPI.getAllNotes().catch(() => []),
            conciergesAPI.getAllConcierges().catch(() => []),
            notificationsAPI.getAllNotifications().catch(() => []),
            messagesAPI.getAllMessages().catch(() => []),
            roomsAPI.getAllRooms().catch(() => []),
            reservationsAPI.getAllReservations().catch(() => []),
        ]);
        setStats({ tasks, complaints, notes, concierges, notifications, messages, rooms, reservations });
        setLoading(false);
    }, []);

    const loadPreferences = useCallback(async () => {
        try {
            const prefs = await userPreferencesAPI.getPreferences();
            if (prefs.dashboardLayout && prefs.dashboardLayout.cards && prefs.dashboardLayout.cards.length > 0) {
                const cards = prefs.dashboardLayout.cards;
                const gridLayout = cards
                    .filter(c => c.visible)
                    .map((c, idx) => ({
                        i: c.id,
                        x: (idx % 4) * 3,
                        y: Math.floor(idx / 4) * 2,
                        w: c.size === 'small' ? 3 : c.size === 'large' ? 12 : 6,
                        h: c.size === 'small' ? 1 : 2
                    }));
                setLayout(gridLayout);
            } else {
                // Use default layout
                const defaultCards = [
                    { i: 'arrivals', x: 0, y: 0, w: 3, h: 1 },
                    { i: 'occupied', x: 3, y: 0, w: 3, h: 1 },
                    { i: 'to-clean', x: 6, y: 0, w: 3, h: 1 },
                    { i: 'tasks', x: 9, y: 0, w: 3, h: 1 },
                    { i: 'complaints', x: 0, y: 1, w: 3, h: 1 },
                    { i: 'notifications', x: 3, y: 1, w: 3, h: 1 },
                    { i: 'messages', x: 6, y: 1, w: 3, h: 1 },
                    { i: 'concierge', x: 9, y: 1, w: 3, h: 1 },
                    { i: 'recent-alerts', x: 0, y: 2, w: 6, h: 2 },
                    { i: 'latest-chat', x: 6, y: 2, w: 6, h: 2 }
                ];
                setLayout(defaultCards);
            }
        } catch (err) {
            console.error('Failed to load preferences:', err);
            // Fallback to default layout
            const defaultCards = [
                { i: 'arrivals', x: 0, y: 0, w: 3, h: 1 },
                { i: 'occupied', x: 3, y: 0, w: 3, h: 1 },
                { i: 'to-clean', x: 6, y: 0, w: 3, h: 1 },
                { i: 'tasks', x: 9, y: 0, w: 3, h: 1 },
                { i: 'complaints', x: 0, y: 1, w: 3, h: 1 },
                { i: 'notifications', x: 3, y: 1, w: 3, h: 1 },
                { i: 'messages', x: 6, y: 1, w: 3, h: 1 },
                { i: 'concierge', x: 9, y: 1, w: 3, h: 1 },
                { i: 'recent-alerts', x: 0, y: 2, w: 6, h: 2 },
                { i: 'latest-chat', x: 6, y: 2, w: 6, h: 2 }
            ];
            setLayout(defaultCards);
        }
    }, []);

    useEffect(() => {
        loadData();
        loadPreferences();
    }, [loadData, loadPreferences]);

    const openTasks = stats.tasks.filter(t => isOpen(t.status)).length;
    const openComplaints = stats.complaints.filter(c => isOpen(c.status)).length;
    const unread = stats.notifications.filter(n => !n.read).length;
    const toClean = stats.rooms.filter(r => r.status === 'Vacant Dirty').length;
    const occupied = stats.rooms.filter(r => r.status === 'Occupied').length;
    const arrivalsToday = stats.reservations.filter(r => isToday(r.checkIn) && r.status === 'Booked').length;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    const recentNotifications = stats.notifications.slice(0, 5);
    const recentMessages = stats.messages.slice(-4).reverse();

    async function handleLayoutChange(newLayout) {
        setLayout(newLayout);
        
        if (!customizeMode) return;
        
        // Save to backend
        try {
            const cards = newLayout.map((l, idx) => ({
                id: l.i,
                type: 'stat',
                title: l.i,
                position: idx,
                visible: true,
                size: l.w === 3 ? 'small' : l.w === 12 ? 'large' : 'medium'
            }));
            
            await userPreferencesAPI.updatePreferences({
                dashboardLayout: { cards }
            });
        } catch (err) {
            console.error('Failed to save layout:', err);
        }
    }

    async function handleRemoveCard(cardId) {
        const newLayout = layout.filter(l => l.i !== cardId);
        setLayout(newLayout);
        await handleLayoutChange(newLayout);
    }

    async function handleResetDashboard() {
        if (!window.confirm('Reset dashboard to default layout?')) return;
        try {
            await userPreferencesAPI.resetDashboard();
            await loadPreferences();
        } catch (err) {
            console.error('Failed to reset dashboard:', err);
        }
    }

    const renderCard = (cardId) => {
        switch (cardId) {
            case 'arrivals':
                return (
                    <DashboardCard key={cardId} customizeMode={customizeMode} onRemove={() => handleRemoveCard(cardId)}>
                        <StatCard label="Arrivals Today" value={arrivalsToday} sub={`${stats.reservations.length} reservations`} icon="🛎" accent="primary" to="/reservations" />
                    </DashboardCard>
                );
            case 'occupied':
                return (
                    <DashboardCard key={cardId} customizeMode={customizeMode} onRemove={() => handleRemoveCard(cardId)}>
                        <StatCard label="Occupied Rooms" value={occupied} sub={`${stats.rooms.length} rooms`} icon="🏨" accent="info" to="/rooms" />
                    </DashboardCard>
                );
            case 'to-clean':
                return (
                    <DashboardCard key={cardId} customizeMode={customizeMode} onRemove={() => handleRemoveCard(cardId)}>
                        <StatCard label="Rooms to Clean" value={toClean} sub="vacant dirty" icon="🧹" accent="warning" to="/rooms" />
                    </DashboardCard>
                );
            case 'tasks':
                return (
                    <DashboardCard key={cardId} customizeMode={customizeMode} onRemove={() => handleRemoveCard(cardId)}>
                        <StatCard label="Open Tasks" value={openTasks} sub={`${stats.tasks.length} total`} icon="✓" accent="warning" to="/tasks" />
                    </DashboardCard>
                );
            case 'complaints':
                return (
                    <DashboardCard key={cardId} customizeMode={customizeMode} onRemove={() => handleRemoveCard(cardId)}>
                        <StatCard label="Open Complaints" value={openComplaints} sub={`${stats.complaints.length} total`} icon="!" accent="danger" to="/complaints" />
                    </DashboardCard>
                );
            case 'notifications':
                return (
                    <DashboardCard key={cardId} customizeMode={customizeMode} onRemove={() => handleRemoveCard(cardId)}>
                        <StatCard label="Unread Alerts" value={unread} sub={`${stats.notifications.length} total`} icon="🔔" accent="info" to="/tasks" />
                    </DashboardCard>
                );
            case 'messages':
                return (
                    <DashboardCard key={cardId} customizeMode={customizeMode} onRemove={() => handleRemoveCard(cardId)}>
                        <StatCard label="Team Messages" value={stats.messages.length} sub="in the chat" icon="💬" accent="accent" to="/chat" />
                    </DashboardCard>
                );
            case 'concierge':
                return (
                    <DashboardCard key={cardId} customizeMode={customizeMode} onRemove={() => handleRemoveCard(cardId)}>
                        <StatCard label="Concierge Items" value={stats.concierges.length} sub="offerings" icon="🧭" accent="success" to="/concierge" />
                    </DashboardCard>
                );
            case 'recent-alerts':
                return (
                    <DashboardCard key={cardId} title="Recent Alerts" customizeMode={customizeMode} onRemove={() => handleRemoveCard(cardId)}>
                        {recentNotifications.length === 0 ? (
                            <p className="muted">No notifications yet.</p>
                        ) : (
                            <ul className="activity-list">
                                {recentNotifications.map(n => (
                                    <li key={n._id} className={n.read ? '' : 'unread'}>
                                        <span className={`dot ${n.type || 'general'}`} />
                                        <span className="activity-text">{n.message}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </DashboardCard>
                );
            case 'latest-chat':
                return (
                    <DashboardCard key={cardId} title="Latest Chat" customizeMode={customizeMode} onRemove={() => handleRemoveCard(cardId)}>
                        {recentMessages.length === 0 ? (
                            <p className="muted">No messages yet.</p>
                        ) : (
                            <ul className="chat-mini">
                                {recentMessages.map(m => (
                                    <li key={m._id}>
                                        <strong>{m.user}</strong> {m.text}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </DashboardCard>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="surface-card page-card muted">Loading dashboard…</div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="dash-header">
                <div>
                    <h1 className="section-title">{greeting}, {user.name.split(' ')[0]}</h1>
                    <p className="section-subtitle">{today} · Front desk overview</p>
                </div>
                <div className="dash-header-actions">
                    {customizeMode && (
                        <Button variant="outline-secondary" size="sm" onClick={handleResetDashboard}>
                            Reset to Default
                        </Button>
                    )}
                    <Button 
                        variant={customizeMode ? 'primary' : 'outline-primary'} 
                        size="sm" 
                        onClick={() => setCustomizeMode(!customizeMode)}
                    >
                        {customizeMode ? 'Done Customizing' : 'Customize Dashboard'}
                    </Button>
                </div>
            </header>

            {customizeMode && (
                <div className="customize-hint">
                    <p>🎨 <strong>Customize Mode:</strong> Drag cards to rearrange, click ✕ to remove. Changes save automatically.</p>
                </div>
            )}

            <ResponsiveGridLayout
                className="dashboard-grid"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={150}
                isDraggable={customizeMode}
                isResizable={customizeMode}
                onLayoutChange={handleLayoutChange}
                compactType="vertical"
                preventCollision={false}
            >
                {layout.map((l) => (
                    <div key={l.i}>
                        {renderCard(l.i)}
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}
