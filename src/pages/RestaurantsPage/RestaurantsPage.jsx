import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Modal, Table, Badge } from 'react-bootstrap';
import * as restaurantsAPI from '../../utilities/restaurants-api';
import './RestaurantsPage.css';

const BLANK_RESTAURANT = {
    name: '',
    description: '',
    cuisine: '',
    totalCapacity: 50,
    reservationDuration: 90,
    advanceBookingDays: 30,
    phone: '',
    email: '',
    hours: {
        monday: { open: '11:00', close: '22:00', closed: false },
        tuesday: { open: '11:00', close: '22:00', closed: false },
        wednesday: { open: '11:00', close: '22:00', closed: false },
        thursday: { open: '11:00', close: '22:00', closed: false },
        friday: { open: '11:00', close: '23:00', closed: false },
        saturday: { open: '11:00', close: '23:00', closed: false },
        sunday: { open: '11:00', close: '22:00', closed: false }
    }
};

const BLANK_TABLE = {
    number: '',
    capacity: 4,
    location: 'Indoor',
    type: 'Standard'
};

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(BLANK_RESTAURANT);
    const [editingId, setEditingId] = useState(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [showTables, setShowTables] = useState(false);
    const [tableForm, setTableForm] = useState(BLANK_TABLE);

    useEffect(() => {
        loadRestaurants();
    }, []);

    async function loadRestaurants() {
        const data = await restaurantsAPI.getAllRestaurants();
        setRestaurants(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                const updated = await restaurantsAPI.updateRestaurant(editingId, form);
                setRestaurants(restaurants.map(r => r._id === editingId ? updated : r));
            } else {
                const created = await restaurantsAPI.createRestaurant(form);
                setRestaurants([created, ...restaurants]);
            }
            setForm(BLANK_RESTAURANT);
            setEditingId(null);
            setShowForm(false);
        } catch (err) {
            console.error('Failed to save restaurant:', err);
        }
    }

    function handleEdit(restaurant) {
        setForm({ ...restaurant });
        setEditingId(restaurant._id);
        setShowForm(true);
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this restaurant? This will also delete all reservations.')) return;
        await restaurantsAPI.deleteRestaurant(id);
        setRestaurants(restaurants.filter(r => r._id !== id));
    }

    function handleManageTables(restaurant) {
        setSelectedRestaurant(restaurant);
        setShowTables(true);
    }

    async function handleAddTable(e) {
        e.preventDefault();
        const updated = await restaurantsAPI.addTable(selectedRestaurant._id, tableForm);
        setSelectedRestaurant(updated);
        setRestaurants(restaurants.map(r => r._id === updated._id ? updated : r));
        setTableForm(BLANK_TABLE);
    }

    async function handleRemoveTable(tableId) {
        const updated = await restaurantsAPI.removeTable(selectedRestaurant._id, tableId);
        setSelectedRestaurant(updated);
        setRestaurants(restaurants.map(r => r._id === updated._id ? updated : r));
    }

    function handleHoursChange(day, field, value) {
        setForm({
            ...form,
            hours: {
                ...form.hours,
                [day]: { ...form.hours[day], [field]: value }
            }
        });
    }

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">🍽️ Restaurant Management</h1>
                    <p className="section-subtitle">{restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}</p>
                </div>
                <button 
                    className="rest-add-btn"
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(BLANK_RESTAURANT); }}
                >
                    {showForm ? '✕ Cancel' : '+ Add Restaurant'}
                </button>
            </header>

            {showForm && (
                <div className="surface-card page-card">
                    <h3 className="form-title">{editingId ? 'Edit Restaurant' : 'Add Restaurant'}</h3>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Label>Restaurant Name *</Form.Label>
                                <Form.Control 
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Cuisine Type</Form.Label>
                                <Form.Control 
                                    value={form.cuisine}
                                    onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                                    placeholder="e.g., Italian, Asian Fusion"
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Label>Description</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    rows={2}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Total Capacity *</Form.Label>
                                <Form.Control 
                                    type="number"
                                    value={form.totalCapacity}
                                    onChange={(e) => setForm({ ...form, totalCapacity: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Reservation Duration (min)</Form.Label>
                                <Form.Control 
                                    type="number"
                                    value={form.reservationDuration}
                                    onChange={(e) => setForm({ ...form, reservationDuration: e.target.value })}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control 
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </Col>
                            
                            <Col md={12}>
                                <h5 className="mt-3 mb-2">Operating Hours</h5>
                            </Col>
                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                <Col md={12} key={day} className="hours-row">
                                    <div className="hours-day-row">
                                        <span className="day-label">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                                        <Form.Check 
                                            type="checkbox"
                                            label="Closed"
                                            checked={form.hours[day].closed}
                                            onChange={(e) => handleHoursChange(day, 'closed', e.target.checked)}
                                        />
                                        {!form.hours[day].closed && (
                                            <>
                                                <Form.Control 
                                                    type="time"
                                                    value={form.hours[day].open}
                                                    onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                                                />
                                                <span>to</span>
                                                <Form.Control 
                                                    type="time"
                                                    value={form.hours[day].close}
                                                    onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                                                />
                                            </>
                                        )}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        <div className="form-actions">
                            <Button type="submit" variant="primary">
                                {editingId ? 'Update Restaurant' : 'Create Restaurant'}
                            </Button>
                        </div>
                    </Form>
                </div>
            )}

            <div className="surface-card page-card">
                {restaurants.length === 0 ? (
                    <div className="empty-state">
                        No restaurants yet. Click "+ Add Restaurant" to create one.
                    </div>
                ) : (
                    <div className="restaurants-grid">
                        {restaurants.map(restaurant => (
                            <div key={restaurant._id} className="restaurant-card">
                                <div className="restaurant-card-header">
                                    <div>
                                        <h4 className="restaurant-card-title">{restaurant.name}</h4>
                                        {restaurant.cuisine && <Badge bg="secondary">{restaurant.cuisine}</Badge>}
                                    </div>
                                    <div className="restaurant-card-actions">
                                        <button onClick={() => handleManageTables(restaurant)} title="Manage tables">🪑</button>
                                        <button onClick={() => handleEdit(restaurant)} title="Edit">✏️</button>
                                        <button onClick={() => handleDelete(restaurant._id)} title="Delete">🗑️</button>
                                    </div>
                                </div>
                                {restaurant.description && <p className="restaurant-description">{restaurant.description}</p>}
                                <div className="restaurant-details">
                                    <div>👥 Capacity: {restaurant.totalCapacity}</div>
                                    <div>🪑 Tables: {restaurant.tables?.length || 0}</div>
                                    <div>⏱️ Duration: {restaurant.reservationDuration} min</div>
                                    {restaurant.phone && <div>📞 {restaurant.phone}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Table Management Modal */}
            <Modal show={showTables} onHide={() => setShowTables(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Manage Tables - {selectedRestaurant?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRestaurant && (
                        <div>
                            <Form onSubmit={handleAddTable} className="mb-4">
                                <h5>Add Table</h5>
                                <Row className="g-2">
                                    <Col md={3}>
                                        <Form.Control 
                                            placeholder="Table #"
                                            value={tableForm.number}
                                            onChange={(e) => setTableForm({ ...tableForm, number: e.target.value })}
                                            required
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control 
                                            type="number"
                                            placeholder="Capacity"
                                            value={tableForm.capacity}
                                            onChange={(e) => setTableForm({ ...tableForm, capacity: e.target.value })}
                                            required
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <Form.Select 
                                            value={tableForm.location}
                                            onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
                                        >
                                            <option>Indoor</option>
                                            <option>Window</option>
                                            <option>Patio</option>
                                            <option>Bar</option>
                                            <option>Private</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Select 
                                            value={tableForm.type}
                                            onChange={(e) => setTableForm({ ...tableForm, type: e.target.value })}
                                        >
                                            <option>Standard</option>
                                            <option>Booth</option>
                                            <option>Bar</option>
                                            <option>High Top</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={2}>
                                        <Button type="submit" size="sm" className="w-100">Add</Button>
                                    </Col>
                                </Row>
                            </Form>

                            <h5>Current Tables ({selectedRestaurant.tables?.length || 0})</h5>
                            {selectedRestaurant.tables?.length > 0 ? (
                                <Table striped hover size="sm" className="tables-table">
                                    <thead>
                                        <tr>
                                            <th>Table #</th>
                                            <th>Capacity</th>
                                            <th>Location</th>
                                            <th>Type</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedRestaurant.tables.map(table => (
                                            <tr key={table._id}>
                                                <td>{table.number}</td>
                                                <td>{table.capacity}</td>
                                                <td>{table.location}</td>
                                                <td>{table.type}</td>
                                                <td>
                                                    <Button 
                                                        size="sm" 
                                                        variant="danger" 
                                                        onClick={() => handleRemoveTable(table._id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p className="text-muted">No tables added yet.</p>
                            )}
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}
