import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import './Home.css'
import Weather from '../../components/Weather/Weather';
import AvatarUpload from '../../components/AvatarUpload/AvatarUpload';
import StatCard from '../../components/StatCard/StatCard';
import GuestRequestForm from '../../components/GuestRequestForm/GuestRequestForm';
import * as tasksAPI from '../../utilities/tasks-api';
import * as complaintsAPI from '../../utilities/complaints-api';
import * as notesAPI from '../../utilities/notes-api';
import * as conciergesAPI from '../../utilities/concierges-api';
import * as notificationsAPI from '../../utilities/notifications-api';
import * as messagesAPI from '../../utilities/messages-api';
import * as roomsAPI from '../../utilities/rooms-api';
import * as reservationsAPI from '../../utilities/reservations-api';

const CLOSED = ['done', 'resolved', 'complete', 'completed', 'closed', 'cancelled'];
const isOpen = (status) => !CLOSED.includes((status || '').toString().trim().toLowerCase());
const isToday = (d) => {
    if (!d) return false;
    const x = new Date(d); const t = new Date();
    return x.getFullYear() === t.getFullYear() && x.getMonth() === t.getMonth() && x.getDate() === t.getDate();
};

export default function Home({ user, setUser }) {
    const [stats, setStats] = useState({ tasks: [], complaints: [], notes: [], concierges: [], notifications: [], messages: [], rooms: [], reservations: [] });

    useEffect(() => {
        async function load() {
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
        }
        load();
    }, []);

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

    return (
        <div className="dashboard">
            <header className="dash-header">
                <div>
                    <h1 className="section-title">{greeting}, {user.name.split(' ')[0]}</h1>
                    <p className="section-subtitle">{today} · Front desk overview</p>
                </div>
            </header>

            <Row className="g-3 dash-stats">
                <Col xs={6} lg={3}><StatCard label="Arrivals Today" value={arrivalsToday} sub={`${stats.reservations.length} reservations`} icon="🛎" accent="primary" to="/reservations" /></Col>
                <Col xs={6} lg={3}><StatCard label="Occupied Rooms" value={occupied} sub={`${stats.rooms.length} rooms`} icon="🏨" accent="info" to="/rooms" /></Col>
                <Col xs={6} lg={3}><StatCard label="Rooms to Clean" value={toClean} sub="vacant dirty" icon="🧹" accent="warning" to="/rooms" /></Col>
                <Col xs={6} lg={3}><StatCard label="Open Tasks" value={openTasks} sub={`${stats.tasks.length} total`} icon="✓" accent="warning" to="/tasks" /></Col>
                <Col xs={6} lg={3}><StatCard label="Open Complaints" value={openComplaints} sub={`${stats.complaints.length} total`} icon="!" accent="danger" to="/complaints" /></Col>
                <Col xs={6} lg={3}><StatCard label="Unread Alerts" value={unread} sub={`${stats.notifications.length} total`} icon="🔔" accent="info" to="/tasks" /></Col>
                <Col xs={6} lg={3}><StatCard label="Team Messages" value={stats.messages.length} sub="in the chat" icon="💬" accent="accent" to="/chat" /></Col>
                <Col xs={6} lg={3}><StatCard label="Concierge Items" value={stats.concierges.length} sub="offerings" icon="🧭" accent="success" to="/concierge" /></Col>
            </Row>

            <Row className="g-3 mt-1">
                <Col lg={7}>
                    <div className="surface-card dash-panel">
                        <h2 className="panel-title">Recent Alerts</h2>
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

                        <h2 className="panel-title mt-4">Latest Chat</h2>
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
                    </div>
                </Col>
                <Col lg={5}>
                    <div className="surface-card dash-panel">
                        <h2 className="panel-title">Log a Guest Request</h2>
                        <GuestRequestForm />
                    </div>
                    <div className="surface-card dash-panel mt-3">
                        <h2 className="panel-title">Your Profile</h2>
                        <AvatarUpload user={user} setUser={setUser} />
                    </div>
                    <div className="dash-weather">
                        <Weather />
                    </div>
                </Col>
            </Row>
        </div>
    );
}
