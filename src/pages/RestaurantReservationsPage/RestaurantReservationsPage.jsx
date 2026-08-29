import { useState, useEffect, useCallback } from 'react';
import { Form, Row, Col, Button, Badge } from 'react-bootstrap';
import * as restaurantReservationsAPI from '../../utilities/restaurantReservations-api';
import * as restaurantsAPI from '../../utilities/restaurants-api';
import './RestaurantReservationsPage.css';

const BLANK_FORM = {
    restaurantId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestRoom: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    partySize: 2,
    specialRequests: '',
    dietaryRestrictions: [],
    occasion: ''
};

export default function RestaurantReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedRestaurant, setSelectedRestaurant] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(BLANK_FORM);
    const [editingId, setEditingId] = useState(null);
    const [availability, setAvailability] = useState(null);

    useEffect(() => {
        loadRestaurants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadReservations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRestaurant, selectedDate, filter]);

    async function loadRestaurants() {
        const data = await restaurantsAPI.getAllRestaurants();
        setRestaurants(data);
        if (data.length > 0 && !form.restaurantId) {
            setForm({ ...form, restaurantId: data[0]._id });
        }
    }

    async function loadReservations() {
        const filters = {};
        if (selectedRestaurant !== 'all') filters.restaurantId = selectedRestaurant;
        if (selectedDate) filters.date = selectedDate;
        if (filter !== 'all') filters.status = filter;
        
        const data = await restaurantReservationsAPI.getAllReservations(filters);
        setReservations(data);
    }

    async function checkAvail() {
        if (!form.restaurantId || !form.date || !form.time || !form.partySize) return;
        try {
            const result = await restaurantReservationsAPI.checkAvailability(
                form.restaurantId,
                form.date,
                form.time,
                form.partySize
            );
            setAvailability(result);
        } catch (err) {
            console.error('Availability check failed:', err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                const updated = await restaurantReservationsAPI.updateReservation(editingId, form);
                setReservations(reservations.map(r => r._id === editingId ? updated : r));
            } else {
                const created = await restaurantReservationsAPI.createReservation(form);
                setReservations([created, ...reservations]);
            }
            setForm(BLANK_FORM);
            setEditingId(null);
            setShowForm(false);
            setAvailability(null);
        } catch (err) {
            console.error('Failed to save reservation:', err);
        }
    }

    function handleEdit(reservation) {
        setForm({
            restaurantId: reservation.restaurantId,
            guestName: reservation.guestName || '',
            guestEmail: reservation.guestEmail || '',
            guestPhone: reservation.guestPhone || '',
            guestRoom: reservation.guestRoom || '',
            date: new Date(reservation.date).toISOString().split('T')[0],
            time: reservation.time || '',
            partySize: reservation.partySize || 2,
            specialRequests: reservation.specialRequests || '',
            dietaryRestrictions: reservation.dietaryRestrictions || [],
            occasion: reservation.occasion || ''
        });
        setEditingId(reservation._id);
        setShowForm(true);
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this reservation?')) return;
        await restaurantReservationsAPI.deleteReservation(id);
        setReservations(reservations.filter(r => r._id !== id));
    }

    async function handleStatusChange(id, status) {
        const updated = await restaurantReservationsAPI.updateStatus(id, status);
        setReservations(reservations.map(r => r._id === updated._id ? updated : r));
    }

    const filtered = reservations.filter(r =>
        search === '' ||
        r.guestName.toLowerCase().includes(search.toLowerCase()) ||
        (r.guestPhone && r.guestPhone.includes(search)) ||
        (r.guestRoom && r.guestRoom.includes(search))
    );

    const statusCount = (status) => reservations.filter(r => r.status === status).length;

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">🍽️ Restaurant Reservations</h1>
                    <p className="section-subtitle">
                        {statusCount('Confirmed')} confirmed · {statusCount('Pending')} pending · {reservations.length} total
                    </p>
                </div>
                <button 
                    className="res-add-btn"
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ ...BLANK_FORM, restaurantId: restaurants[0]?._id || '' }); setAvailability(null); }}
                >
                    {showForm ? '✕ Cancel' : '+ New Reservation'}
                </button>
            </header>

            {showForm && (
                <div className="surface-card page-card">
                    <h3 className="form-title">{editingId ? 'Edit Reservation' : 'New Reservation'}</h3>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Label>Restaurant *</Form.Label>
                                <Form.Select 
                                    value={form.restaurantId}
                                    onChange={(e) => { setForm({ ...form, restaurantId: e.target.value }); setAvailability(null); }}
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
                                <Form.Label>Phone</Form.Label>
                                <Form.Control 
                                    value={form.guestPhone}
                                    onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
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
                                    onChange={(e) => { setForm({ ...form, date: e.target.value }); setAvailability(null); }}
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Time *</Form.Label>
                                <Form.Control 
                                    type="time"
                                    value={form.time}
                                    onChange={(e) => { setForm({ ...form, time: e.target.value }); setAvailability(null); }}
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Party Size *</Form.Label>
                                <Form.Control 
                                    type="number"
                                    min="1"
                                    value={form.partySize}
                                    onChange={(e) => { setForm({ ...form, partySize: e.target.value }); setAvailability(null); }}
                                    required
                                />
                            </Col>
                            
                            {!editingId && (
                                <Col md={12}>
                                    <Button onClick={checkAvail} variant="secondary" size="sm">
                                        Check Availability
                                    </Button>
                                    {availability && (
                                        <div className={`availability-msg ${availability.available ? 'available' : 'unavailable'}`}>
                                            {availability.available ? (
                                                `✅ Available! (${availability.availableCapacity} seats free)`
                                            ) : (
                                                `❌ Fully booked (${availability.totalCapacity - availability.availableCapacity} seats reserved)`
                                            )}
                                        </div>
                                    )}
                                </Col>
                            )}

                            <Col md={6}>
                                <Form.Label>Occasion</Form.Label>
                                <Form.Select 
                                    value={form.occasion}
                                    onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                                >
                                    <option value="">None</option>
                                    <option>Birthday</option>
                                    <option>Anniversary</option>
                                    <option>Business</option>
                                    <option>Date Night</option>
                                    <option>Celebration</option>
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Label>Dietary Restrictions (comma-separated)</Form.Label>
                                <Form.Control 
                                    value={form.dietaryRestrictions.join(', ')}
                                    onChange={(e) => setForm({ ...form, dietaryRestrictions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                    placeholder="e.g., Vegan, Gluten-free"
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Label>Special Requests</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    rows={2}
                                    value={form.specialRequests}
                                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                                    placeholder="Window table, quiet area, highchair, etc."
                                />
                            </Col>
                        </Row>
                        <div className="form-actions">
                            <Button type="submit" variant="primary">
                                {editingId ? 'Update Reservation' : 'Create Reservation'}
                            </Button>
                        </div>
                    </Form>
                </div>
            )}

            <div className="surface-card page-card">
                <div className="toolbar">
                    <input
                        type="text"
                        className="search-box"
                        placeholder="🔍 Search by guest, phone, or room..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
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
                        <button className={`pill ${filter === 'Pending' ? 'active' : ''}`} onClick={() => setFilter('Pending')}>Pending</button>
                        <button className={`pill ${filter === 'Confirmed' ? 'active' : ''}`} onClick={() => setFilter('Confirmed')}>Confirmed</button>
                        <button className={`pill ${filter === 'Seated' ? 'active' : ''}`} onClick={() => setFilter('Seated')}>Seated</button>
                        <button className={`pill ${filter === 'Completed' ? 'active' : ''}`} onClick={() => setFilter('Completed')}>Completed</button>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        {search || filter !== 'all' ? 'No reservations match your filters' : 'No reservations yet. Click "+ New Reservation" to create one.'}
                    </div>
                ) : (
                    <>
                        {/* Desktop Grid */}
                        <div className="reservations-grid-desktop">
                            {filtered.map(res => (
                                <div key={res._id} className="reservation-card">
                                    <div className="reservation-card-header">
                                        <div>
                                            <h4 className="reservation-card-title">{res.guestName}</h4>
                                            <Badge bg={
                                                res.status === 'Confirmed' ? 'success' : 
                                                res.status === 'Pending' ? 'warning' : 
                                                res.status === 'Seated' ? 'info' : 
                                                res.status === 'Completed' ? 'secondary' : 'danger'
                                            }>
                                                {res.status}
                                            </Badge>
                                        </div>
                                        <div className="reservation-card-actions">
                                            {res.status === 'Pending' && (
                                                <button onClick={() => handleStatusChange(res._id, 'Confirmed')} title="Confirm">✅</button>
                                            )}
                                            {res.status === 'Confirmed' && (
                                                <button onClick={() => handleStatusChange(res._id, 'Seated')} title="Mark seated">🪑</button>
                                            )}
                                            {res.status === 'Seated' && (
                                                <button onClick={() => handleStatusChange(res._id, 'Completed')} title="Complete">✔️</button>
                                            )}
                                            <button onClick={() => handleEdit(res)} title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(res._id)} title="Delete">🗑️</button>
                                        </div>
                                    </div>
                                    <div className="reservation-details">
                                        <div>🍽️ {res.restaurantName}</div>
                                        <div>📅 {new Date(res.date).toLocaleDateString()} at {res.time}</div>
                                        <div>👥 Party of {res.partySize}</div>
                                        {res.guestRoom && <div>🚪 Room {res.guestRoom}</div>}
                                        {res.guestPhone && <div>📞 {res.guestPhone}</div>}
                                        {res.occasion && <div>🎉 {res.occasion}</div>}
                                        {res.confirmationNumber && <div className="conf-number">#{res.confirmationNumber}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile List */}
                        <div className="reservations-list-mobile">
                            {filtered.map(res => (
                                <div key={res._id} className="reservation-card-mobile">
                                    <div className="reservation-mobile-header">
                                        <div>
                                            <div className="reservation-mobile-title">{res.guestName}</div>
                                            <Badge bg={
                                                res.status === 'Confirmed' ? 'success' : 
                                                res.status === 'Pending' ? 'warning' : 
                                                res.status === 'Seated' ? 'info' : 
                                                res.status === 'Completed' ? 'secondary' : 'danger'
                                            }>
                                                {res.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="reservation-mobile-details">
                                        <div>🍽️ {res.restaurantName}</div>
                                        <div>📅 {new Date(res.date).toLocaleDateString()} · {res.time}</div>
                                        <div>👥 {res.partySize} guests</div>
                                        {res.guestRoom && <div>🚪 Room {res.guestRoom}</div>}
                                    </div>
                                    <div className="reservation-mobile-actions">
                                        {res.status === 'Pending' && (
                                            <button onClick={() => handleStatusChange(res._id, 'Confirmed')}>Confirm</button>
                                        )}
                                        {res.status === 'Confirmed' && (
                                            <button onClick={() => handleStatusChange(res._id, 'Seated')}>Seated</button>
                                        )}
                                        {res.status === 'Seated' && (
                                            <button onClick={() => handleStatusChange(res._id, 'Completed')}>Complete</button>
                                        )}
                                        <button onClick={() => handleEdit(res)}>Edit</button>
                                        <button onClick={() => handleDelete(res._id)} className="delete-btn">Delete</button>
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
