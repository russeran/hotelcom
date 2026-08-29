import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Badge, Table } from 'react-bootstrap';
import * as waitlistAPI from '../../utilities/waitlist-api';
import * as restaurantsAPI from '../../utilities/restaurants-api';
import './WaitlistPage.css';

const BLANK_FORM = {
    restaurantId: '',
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    guestRoom: '',
    date: new Date().toISOString().split('T')[0],
    requestedTime: '',
    partySize: 2,
    specialRequests: '',
    seatingPreferences: []
};

export default function WaitlistPage() {
    const [waitlist, setWaitlist] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [filter, setFilter] = useState('Waiting');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(BLANK_FORM);

    useEffect(() => {
        loadRestaurants();
    }, []);

    useEffect(() => {
        loadWaitlist();
    }, [selectedRestaurant, selectedDate, filter]);

    async function loadRestaurants() {
        const data = await restaurantsAPI.getAllRestaurants();
        setRestaurants(data);
        if (data.length > 0 && !form.restaurantId) {
            setForm({ ...form, restaurantId: data[0]._id });
        }
    }

    async function loadWaitlist() {
        const filters = {};
        if (selectedRestaurant !== 'all') filters.restaurantId = selectedRestaurant;
        if (selectedDate) filters.date = selectedDate;
        if (filter !== 'all') filters.status = filter;
        
        const data = await waitlistAPI.getAllWaitlist(filters);
        setWaitlist(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const created = await waitlistAPI.createWaitlistEntry(form);
            setWaitlist([created, ...waitlist]);
            setForm(BLANK_FORM);
            setShowForm(false);
        } catch (err) {
            console.error('Failed to add to waitlist:', err);
        }
    }

    async function handleNotify(id) {
        try {
            await waitlistAPI.notifyGuest(id);
            await loadWaitlist();
            alert('Guest notified! SMS sent.');
        } catch (err) {
            console.error('Failed to notify guest:', err);
        }
    }

    async function handleConvert(id) {
        if (!window.confirm('Convert this waitlist entry to a confirmed reservation?')) return;
        try {
            const result = await waitlistAPI.convertToReservation(id);
            await loadWaitlist();
            alert(`Reservation created! Confirmation: ${result.reservation.confirmationNumber}`);
        } catch (err) {
            console.error('Failed to convert:', err);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Remove from waitlist?')) return;
        await waitlistAPI.deleteWaitlistEntry(id);
        setWaitlist(waitlist.filter(w => w._id !== id));
    }

    const waitingCount = waitlist.filter(w => w.status === 'Waiting').length;
    const notifiedCount = waitlist.filter(w => w.status === 'Notified').length;

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">📋 Waitlist Management</h1>
                    <p className="section-subtitle">
                        {waitingCount} waiting · {notifiedCount} notified · {waitlist.length} total
                    </p>
                </div>
                <button 
                    className="waitlist-add-btn"
                    onClick={() => { 
                        setShowForm(!showForm); 
                        setForm({ ...BLANK_FORM, restaurantId: restaurants[0]?._id || '' }); 
                    }}
                >
                    {showForm ? '✕ Cancel' : '+ Add to Waitlist'}
                </button>
            </header>

            {showForm && (
                <div className="surface-card page-card">
                    <h3 className="form-title">Add Guest to Waitlist</h3>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Label>Restaurant *</Form.Label>
                                <Form.Select 
                                    value={form.restaurantId}
                                    onChange={(e) => setForm({ ...form, restaurantId: e.target.value })}
                                    required
                                >
                                    {restaurants.map(r => (
                                        <option key={r._id} value={r._id}>{r.name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Label>Guest Name *</Form.Label>
                                <Form.Control 
                                    value={form.guestName}
                                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Phone * (for notifications)</Form.Label>
                                <Form.Control 
                                    value={form.guestPhone}
                                    onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email"
                                    value={form.guestEmail}
                                    onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Room # (if hotel guest)</Form.Label>
                                <Form.Control 
                                    value={form.guestRoom}
                                    onChange={(e) => setForm({ ...form, guestRoom: e.target.value })}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Date *</Form.Label>
                                <Form.Control 
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Requested Time (optional)</Form.Label>
                                <Form.Control 
                                    type="time"
                                    value={form.requestedTime}
                                    onChange={(e) => setForm({ ...form, requestedTime: e.target.value })}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Party Size *</Form.Label>
                                <Form.Control 
                                    type="number"
                                    min="1"
                                    value={form.partySize}
                                    onChange={(e) => setForm({ ...form, partySize: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Label>Special Requests</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    rows={2}
                                    value={form.specialRequests}
                                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                                    placeholder="Seating preferences, dietary restrictions, etc."
                                />
                            </Col>
                        </Row>
                        <div className="form-actions">
                            <Button type="submit" variant="primary">Add to Waitlist</Button>
                        </div>
                    </Form>
                </div>
            )}

            <div className="surface-card page-card">
                <div className="toolbar">
                    <div className="filter-row">
                        <Form.Select 
                            value={selectedRestaurant}
                            onChange={(e) => setSelectedRestaurant(e.target.value)}
                            className="restaurant-filter"
                        >
                            <option value="all">All Restaurants</option>
                            {restaurants.map(r => (
                                <option key={r._id} value={r._id}>{r.name}</option>
                            ))}
                        </Form.Select>
                        <Form.Control 
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="date-filter"
                        />
                    </div>
                    <div className="filter-pills">
                        <button className={`pill ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button className={`pill ${filter === 'Waiting' ? 'active' : ''}`} onClick={() => setFilter('Waiting')}>Waiting</button>
                        <button className={`pill ${filter === 'Notified' ? 'active' : ''}`} onClick={() => setFilter('Notified')}>Notified</button>
                        <button className={`pill ${filter === 'Seated' ? 'active' : ''}`} onClick={() => setFilter('Seated')}>Seated</button>
                    </div>
                </div>

                {waitlist.length === 0 ? (
                    <div className="empty-state">
                        {filter !== 'all' ? 'No guests match your filters' : 'No guests on waitlist. Click "+ Add to Waitlist" when restaurant is fully booked.'}
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <Table hover responsive className="waitlist-table">
                            <thead>
                                <tr>
                                    <th>Position</th>
                                    <th>Guest</th>
                                    <th>Restaurant</th>
                                    <th>Party Size</th>
                                    <th>Est. Wait</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {waitlist.map(entry => (
                                    <tr key={entry._id}>
                                        <td><Badge bg="info">#{entry.position}</Badge></td>
                                        <td>
                                            <strong>{entry.guestName}</strong>
                                            {entry.guestRoom && <div className="text-muted small">Room {entry.guestRoom}</div>}
                                        </td>
                                        <td>{entry.restaurantName}</td>
                                        <td>{entry.partySize}</td>
                                        <td>{entry.estimatedWait ? `${entry.estimatedWait} min` : '—'}</td>
                                        <td>{entry.guestPhone}</td>
                                        <td>
                                            <Badge bg={
                                                entry.status === 'Waiting' ? 'warning' :
                                                entry.status === 'Notified' ? 'info' :
                                                entry.status === 'Seated' ? 'success' : 'secondary'
                                            }>
                                                {entry.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {entry.status === 'Waiting' && (
                                                    <Button size="sm" variant="primary" onClick={() => handleNotify(entry._id)}>
                                                        Notify
                                                    </Button>
                                                )}
                                                {(entry.status === 'Waiting' || entry.status === 'Notified') && (
                                                    <Button size="sm" variant="success" onClick={() => handleConvert(entry._id)}>
                                                        Seat
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(entry._id)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Mobile Cards */}
                        <div className="waitlist-list-mobile">
                            {waitlist.map(entry => (
                                <div key={entry._id} className="waitlist-card-mobile">
                                    <div className="waitlist-mobile-header">
                                        <div>
                                            <Badge bg="info" className="me-2">#{entry.position}</Badge>
                                            <span className="waitlist-mobile-name">{entry.guestName}</span>
                                        </div>
                                        <Badge bg={
                                            entry.status === 'Waiting' ? 'warning' :
                                            entry.status === 'Notified' ? 'info' :
                                            entry.status === 'Seated' ? 'success' : 'secondary'
                                        }>
                                            {entry.status}
                                        </Badge>
                                    </div>
                                    <div className="waitlist-mobile-details">
                                        <div>🍽️ {entry.restaurantName}</div>
                                        <div>👥 Party of {entry.partySize}</div>
                                        <div>⏱️ Est. wait: {entry.estimatedWait ? `${entry.estimatedWait} min` : 'TBD'}</div>
                                        <div>📞 {entry.guestPhone}</div>
                                        {entry.guestRoom && <div>🚪 Room {entry.guestRoom}</div>}
                                    </div>
                                    <div className="waitlist-mobile-actions">
                                        {entry.status === 'Waiting' && (
                                            <button onClick={() => handleNotify(entry._id)}>Notify</button>
                                        )}
                                        {(entry.status === 'Waiting' || entry.status === 'Notified') && (
                                            <button onClick={() => handleConvert(entry._id)}>Seat</button>
                                        )}
                                        <button onClick={() => handleDelete(entry._id)} className="delete-btn">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
