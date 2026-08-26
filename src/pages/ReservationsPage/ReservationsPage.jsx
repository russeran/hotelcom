import { useEffect, useState, useMemo } from 'react';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import * as reservationsAPI from '../../utilities/reservations-api';
import { canManage } from '../../utilities/users-service';
import './ReservationsPage.css';

const BLANK = { guestName: '', room: '', checkIn: '', checkOut: '' };
const isToday = (d) => {
    if (!d) return false;
    const x = new Date(d); const t = new Date();
    return x.getFullYear() === t.getFullYear() && x.getMonth() === t.getMonth() && x.getDate() === t.getDate();
};
const fmt = (d) => d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—';

export default function ReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [form, setForm] = useState(BLANK);
    const [filter, setFilter] = useState('all');
    const manage = canManage();

    useEffect(() => {
        reservationsAPI.getAllReservations().then(setReservations).catch(() => setReservations([]));
    }, []);

    async function handleAdd(e) {
        e.preventDefault();
        const created = await reservationsAPI.addReservation(form);
        setReservations([created, ...reservations]);
        setForm(BLANK);
    }

    async function setStatus(r, status) {
        const updated = await reservationsAPI.updateReservation(r._id, { status });
        setReservations(reservations.map(x => (x._id === r._id ? updated : x)));
    }

    async function handleDelete(r) {
        await reservationsAPI.deleteReservation(r._id);
        setReservations(reservations.filter(x => x._id !== r._id));
    }

    const arrivals = reservations.filter(r => isToday(r.checkIn) && r.status === 'Booked').length;
    const departures = reservations.filter(r => isToday(r.checkOut) && r.status === 'Checked In').length;

    const visible = useMemo(() => {
        if (filter === 'arrivals') return reservations.filter(r => isToday(r.checkIn));
        if (filter === 'inhouse') return reservations.filter(r => r.status === 'Checked In');
        if (filter === 'departures') return reservations.filter(r => isToday(r.checkOut));
        return reservations;
    }, [reservations, filter]);

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">Reservations</h1>
                    <p className="section-subtitle">{arrivals} arrivals today · {departures} departures today · {reservations.length} total</p>
                </div>
            </header>

            <div className="surface-card page-card">
                <Form onSubmit={handleAdd}>
                    <Row className="g-2 align-items-end">
                        <Col md={4}>
                            <Form.Label>Guest name</Form.Label>
                            <Form.Control value={form.guestName} onChange={e => setForm({ ...form, guestName: e.target.value })} placeholder="Guest name" required />
                        </Col>
                        <Col md={2}>
                            <Form.Label>Room</Form.Label>
                            <Form.Control value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="101" />
                        </Col>
                        <Col md={2}>
                            <Form.Label>Check-in</Form.Label>
                            <Form.Control type="date" value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} />
                        </Col>
                        <Col md={2}>
                            <Form.Label>Check-out</Form.Label>
                            <Form.Control type="date" value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} />
                        </Col>
                        <Col md={2}>
                            <Button type="submit" variant="primary" className="w-100">Add</Button>
                        </Col>
                    </Row>
                </Form>
            </div>

            <div className="toolbar">
                <div className="filter-pills">
                    {[['all', 'All'], ['arrivals', "Today's Arrivals"], ['inhouse', 'In-House'], ['departures', "Today's Departures"]].map(([f, label]) => (
                        <button key={f} className={`pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{label}</button>
                    ))}
                </div>
            </div>

            <div className="surface-card page-card">
                {visible.length === 0 ? (
                    <div className="empty-state">No reservations match this view.</div>
                ) : (
                    <Table hover responsive className="align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Status</th><th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map(r => (
                                <tr key={r._id}>
                                    <td>{r.guestName}</td>
                                    <td>{r.room || '—'}</td>
                                    <td className={isToday(r.checkIn) ? 'res-today' : ''}>{fmt(r.checkIn)}</td>
                                    <td className={isToday(r.checkOut) ? 'res-today' : ''}>{fmt(r.checkOut)}</td>
                                    <td><StatusBadge status={r.status} /></td>
                                    <td className="text-end text-nowrap">
                                        {r.status === 'Booked' && <Button size="sm" variant="success" onClick={() => setStatus(r, 'Checked In')}>Check In</Button>}
                                        {r.status === 'Checked In' && <Button size="sm" variant="outline-primary" onClick={() => setStatus(r, 'Checked Out')}>Check Out</Button>}
                                        {' '}
                                        {manage && r.status !== 'Cancelled' && r.status !== 'Checked Out' && (
                                            <Button size="sm" variant="outline-secondary" onClick={() => setStatus(r, 'Cancelled')}>Cancel</Button>
                                        )}
                                        {' '}
                                        {manage && <Button size="sm" variant="outline-danger" onClick={() => handleDelete(r)}>Delete</Button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </div>
    );
}
