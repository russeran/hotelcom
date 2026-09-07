import { useEffect, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import * as roomsAPI from '../../utilities/rooms-api';
import { canManage } from '../../utilities/users-service';
import './RoomsPage.css';

const STATUS_CLASS = {
    'Vacant Clean': 'rs-clean',
    'Vacant Dirty': 'rs-dirty',
    'Occupied': 'rs-occupied',
    'Inspected': 'rs-inspected',
    'Out of Order': 'rs-ooo',
};

const BLANK = { number: '', type: 'King', status: 'Vacant Clean' };

export default function RoomsPage() {
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState(BLANK);
    const [showForm, setShowForm] = useState(false);
    const manage = canManage();

    useEffect(() => {
        roomsAPI.getAllRooms().then(setRooms).catch(() => setRooms([]));
    }, []);

    async function handleAdd(e) {
        e.preventDefault();
        const room = await roomsAPI.addRoom(form);
        setRooms([...rooms, room].sort((a, b) => (a.number > b.number ? 1 : -1)));
        setForm(BLANK);
        setShowForm(false);
    }

    async function changeStatus(room, status) {
        const updated = await roomsAPI.updateRoom(room._id, { status });
        setRooms(rooms.map(r => (r._id === room._id ? updated : r)));
    }

    async function handleDelete(room) {
        await roomsAPI.deleteRoom(room._id);
        setRooms(rooms.filter(r => r._id !== room._id));
    }

    const counts = roomsAPI.ROOM_STATUSES.reduce((acc, s) => {
        acc[s] = rooms.filter(r => r.status === s).length;
        return acc;
    }, {});

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">Room Status Board</h1>
                    <p className="section-subtitle">
                        {rooms.length} rooms · {counts['Occupied'] || 0} occupied · {counts['Vacant Dirty'] || 0} need cleaning
                    </p>
                </div>
                {manage && (
                    <button 
                        className="room-add-btn"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '✕ Cancel' : '+ Add Room'}
                    </button>
                )}
            </header>

            <div className="rs-legend">
                {roomsAPI.ROOM_STATUSES.map(s => (
                    <span key={s} className={`rs-chip ${STATUS_CLASS[s]}`}>{s} · {counts[s] || 0}</span>
                ))}
            </div>

            {manage && showForm && (
                <div className="surface-card page-card">
                    <Form onSubmit={handleAdd}>
                        <Row className="g-2 align-items-end room-form-row">
                            <Col md={3}>
                                <Form.Label>Room number</Form.Label>
                                <Form.Control value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="101" required />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Type</Form.Label>
                                <Form.Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    <option>King</option><option>Queen</option><option>Double</option><option>Suite</option><option>Accessible</option>
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Label>Status</Form.Label>
                                <Form.Select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                    {roomsAPI.ROOM_STATUSES.map(s => <option key={s}>{s}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Button type="submit" variant="primary" className="w-100">Add Room</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            )}

            {rooms.length === 0 ? (
                <div className="surface-card page-card empty-state">No rooms yet{manage ? ' — add one above.' : '.'}</div>
            ) : (
                <div className="rooms-grid">
                    {rooms.map(room => (
                        <div key={room._id} className={`room-card ${STATUS_CLASS[room.status] || ''}`}>
                            <div className="room-top">
                                <span className="room-number">{room.number}</span>
                                <span className="room-type">{room.type}</span>
                            </div>
                            <Form.Select
                                size="sm"
                                className="room-status-select"
                                aria-label={`Status for room ${room.number}`}
                                value={room.status}
                                onChange={(e) => changeStatus(room, e.target.value)}
                            >
                                {roomsAPI.ROOM_STATUSES.map(s => <option key={s}>{s}</option>)}
                            </Form.Select>
                            {manage && (
                                <button className="room-delete" onClick={() => handleDelete(room)} aria-label={`Delete room ${room.number}`} title="Delete room">×</button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
