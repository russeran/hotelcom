import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import * as tasksAPI from '../../utilities/tasks-api';
import * as complaintsAPI from '../../utilities/complaints-api';
import * as notesAPI from '../../utilities/notes-api';
import * as conciergesAPI from '../../utilities/concierges-api';
import * as reservationsAPI from '../../utilities/reservations-api';
import * as roomsAPI from '../../utilities/rooms-api';

function match(q, ...fields) {
    return fields.some(f => (f ?? '').toString().toLowerCase().includes(q));
}

export default function SearchPage() {
    const [params] = useSearchParams();
    const q = (params.get('q') || '').trim().toLowerCase();
    const [data, setData] = useState(null);

    useEffect(() => {
        Promise.all([
            tasksAPI.getAllTasks().catch(() => []),
            complaintsAPI.getAllComplaints().catch(() => []),
            notesAPI.getAllNotes().catch(() => []),
            conciergesAPI.getAllConcierges().catch(() => []),
            reservationsAPI.getAllReservations().catch(() => []),
            roomsAPI.getAllRooms().catch(() => []),
        ]).then(([tasks, complaints, notes, concierges, reservations, rooms]) =>
            setData({ tasks, complaints, notes, concierges, reservations, rooms }));
    }, []);

    if (!q) return <div className="page"><div className="surface-card page-card empty-state">Type a search term in the top bar.</div></div>;
    if (!data) return <div className="page"><div className="surface-card page-card muted">Searching…</div></div>;

    const groups = [
        { title: 'Tasks', to: '/tasks', items: data.tasks.filter(t => match(q, t.task, t.department, t.user, t.room, t.status, t.priority)).map(t => `${t.priority} · ${t.department} · ${t.task}`) },
        { title: 'Complaints', to: '/complaints', items: data.complaints.filter(c => match(q, c.name, c.issue, c.solution, c.room, c.department, c.status)).map(c => `Room ${c.room} · ${c.name} · ${c.issue}`) },
        { title: 'Reservations', to: '/reservations', items: data.reservations.filter(r => match(q, r.guestName, r.room, r.status)).map(r => `${r.guestName} · room ${r.room || '—'} · ${r.status}`) },
        { title: 'Rooms', to: '/rooms', items: data.rooms.filter(r => match(q, r.number, r.type, r.status, r.notes)).map(r => `Room ${r.number} · ${r.type || ''} · ${r.status}`) },
        { title: 'Notes', to: '/notes', items: data.notes.filter(n => match(q, n.note, n.user, n.department)).map(n => `${n.user || '—'} · ${n.note}`) },
        { title: 'Concierge', to: '/concierge', items: data.concierges.filter(c => match(q, c.name, c.type, c.note, c.address)).map(c => `${c.type} · ${c.name}`) },
    ];
    const total = groups.reduce((s, g) => s + g.items.length, 0);

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">Search</h1>
                    <p className="section-subtitle">{total} result{total === 1 ? '' : 's'} for “{params.get('q')}”</p>
                </div>
            </header>
            {total === 0 && <div className="surface-card page-card empty-state">No matches found.</div>}
            {groups.filter(g => g.items.length).map(g => (
                <div key={g.title} className="surface-card page-card">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h2 className="panel-title mb-0">{g.title} <span className="muted">({g.items.length})</span></h2>
                        <Link to={g.to}>Open</Link>
                    </div>
                    <ul className="mb-0">
                        {g.items.slice(0, 10).map((txt, i) => <li key={i} className="search-result">{txt}</li>)}
                    </ul>
                </div>
            ))}
        </div>
    );
}
