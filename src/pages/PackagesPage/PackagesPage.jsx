import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Badge, Modal } from 'react-bootstrap';
import * as packagesAPI from '../../utilities/packages-api';
import './PackagesPage.css';

const BLANK_FORM = {
    guestName: '',
    room: '',
    carrier: '',
    trackingNumber: '',
    description: '',
    receivedDate: new Date().toISOString().split('T')[0],
    storageLocation: '',
    notes: ''
};

export default function PackagesPage() {
    const [packages, setPackages] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(BLANK_FORM);
    const [editingId, setEditingId] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showNotify, setShowNotify] = useState(false);
    const [showPickup, setShowPickup] = useState(false);
    const [notifyMethod, setNotifyMethod] = useState('Phone');
    const [signedBy, setSignedBy] = useState('');

    useEffect(() => {
        loadPackages();
    }, []);

    async function loadPackages() {
        const data = await packagesAPI.getAllPackages();
        setPackages(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                const updated = await packagesAPI.updatePackage(editingId, form);
                setPackages(packages.map(pkg => pkg._id === editingId ? updated : pkg));
            } else {
                const created = await packagesAPI.createPackage(form);
                setPackages([created, ...packages]);
            }
            setForm(BLANK_FORM);
            setEditingId(null);
            setShowForm(false);
        } catch (err) {
            console.error('Failed to save package:', err);
        }
    }

    function handleEdit(pkg) {
        setForm({
            guestName: pkg.guestName || '',
            room: pkg.room || '',
            carrier: pkg.carrier || '',
            trackingNumber: pkg.trackingNumber || '',
            description: pkg.description || '',
            receivedDate: pkg.receivedDate ? new Date(pkg.receivedDate).toISOString().split('T')[0] : '',
            storageLocation: pkg.storageLocation || '',
            notes: pkg.notes || ''
        });
        setEditingId(pkg._id);
        setShowForm(true);
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this package?')) return;
        await packagesAPI.deletePackage(id);
        setPackages(packages.filter(pkg => pkg._id !== id));
    }

    function handleNotify(pkg) {
        setSelectedPackage(pkg);
        setShowNotify(true);
    }

    async function handleSubmitNotify(e) {
        e.preventDefault();
        const updated = await packagesAPI.markNotified(selectedPackage._id, notifyMethod);
        setPackages(packages.map(pkg => pkg._id === updated._id ? updated : pkg));
        setShowNotify(false);
        setNotifyMethod('Phone');
    }

    function handlePickup(pkg) {
        setSelectedPackage(pkg);
        setShowPickup(true);
    }

    async function handleSubmitPickup(e) {
        e.preventDefault();
        const updated = await packagesAPI.markPickedUp(selectedPackage._id, signedBy);
        setPackages(packages.map(pkg => pkg._id === updated._id ? updated : pkg));
        setShowPickup(false);
        setSignedBy('');
    }

    const filtered = packages.filter(pkg => {
        const matchesFilter = filter === 'all' || pkg.status === filter;
        const matchesSearch = search === '' ||
            pkg.guestName.toLowerCase().includes(search.toLowerCase()) ||
            pkg.room.toLowerCase().includes(search.toLowerCase()) ||
            (pkg.carrier && pkg.carrier.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const receivedCount = packages.filter(p => p.status === 'Received').length;
    const notifiedCount = packages.filter(p => p.status === 'Notified').length;

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">📦 Package Management</h1>
                    <p className="section-subtitle">{receivedCount} received · {notifiedCount} notified · {packages.length} total</p>
                </div>
                <button 
                    className="pkg-add-btn"
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(BLANK_FORM); }}
                >
                    {showForm ? '✕ Cancel' : '+ Log Package'}
                </button>
            </header>

            {showForm && (
                <div className="surface-card page-card">
                    <h3 className="form-title">{editingId ? 'Edit Package' : 'Log New Package'}</h3>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Label>Guest Name *</Form.Label>
                                <Form.Control 
                                    value={form.guestName}
                                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                                    placeholder="Full name"
                                    required
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Room # *</Form.Label>
                                <Form.Control 
                                    value={form.room}
                                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                                    placeholder="e.g., 305"
                                    required
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Received Date *</Form.Label>
                                <Form.Control 
                                    type="date"
                                    value={form.receivedDate}
                                    onChange={(e) => setForm({ ...form, receivedDate: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Carrier</Form.Label>
                                <Form.Control 
                                    value={form.carrier}
                                    onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                                    placeholder="e.g., FedEx, UPS, USPS"
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Tracking Number</Form.Label>
                                <Form.Control 
                                    value={form.trackingNumber}
                                    onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Storage Location</Form.Label>
                                <Form.Control 
                                    value={form.storageLocation}
                                    onChange={(e) => setForm({ ...form, storageLocation: e.target.value })}
                                    placeholder="e.g., Back office, Shelf A3"
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Label>Description</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    rows={2}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Package details (size, fragile, etc.)"
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Label>Notes</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    rows={2}
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    placeholder="Additional notes..."
                                />
                            </Col>
                        </Row>
                        <div className="form-actions">
                            <Button type="submit" variant="primary">
                                {editingId ? 'Update Package' : 'Log Package'}
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
                        placeholder="🔍 Search by guest, room, or carrier..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="filter-pills">
                        <button 
                            className={`pill ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`pill ${filter === 'Received' ? 'active' : ''}`}
                            onClick={() => setFilter('Received')}
                        >
                            Received
                        </button>
                        <button 
                            className={`pill ${filter === 'Notified' ? 'active' : ''}`}
                            onClick={() => setFilter('Notified')}
                        >
                            Notified
                        </button>
                        <button 
                            className={`pill ${filter === 'Picked Up' ? 'active' : ''}`}
                            onClick={() => setFilter('Picked Up')}
                        >
                            Picked Up
                        </button>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        {search || filter !== 'all' ? 'No packages match your filters' : 'No packages yet. Click "+ Log Package" to add one.'}
                    </div>
                ) : (
                    <>
                        {/* Desktop Grid */}
                        <div className="pkg-grid-desktop">
                            {filtered.map(pkg => (
                                <div key={pkg._id} className="pkg-card">
                                    <div className="pkg-card-header">
                                        <div>
                                            <h4 className="pkg-card-title">{pkg.guestName}</h4>
                                            <Badge bg={pkg.status === 'Received' ? 'warning' : pkg.status === 'Notified' ? 'info' : 'success'}>
                                                {pkg.status}
                                            </Badge>
                                        </div>
                                        <div className="pkg-card-actions">
                                            {pkg.status === 'Received' && (
                                                <button onClick={() => handleNotify(pkg)} title="Notify guest">📢</button>
                                            )}
                                            {(pkg.status === 'Received' || pkg.status === 'Notified') && (
                                                <button onClick={() => handlePickup(pkg)} title="Mark picked up">✅</button>
                                            )}
                                            <button onClick={() => handleEdit(pkg)} title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(pkg._id)} title="Delete">🗑️</button>
                                        </div>
                                    </div>
                                    <div className="pkg-card-detail">🚪 Room {pkg.room}</div>
                                    {pkg.carrier && <div className="pkg-card-detail">📮 {pkg.carrier}</div>}
                                    {pkg.trackingNumber && <div className="pkg-card-detail">🔢 {pkg.trackingNumber}</div>}
                                    <div className="pkg-card-detail">📅 Received: {new Date(pkg.receivedDate).toLocaleDateString()}</div>
                                    {pkg.storageLocation && <div className="pkg-card-detail">🗄️ {pkg.storageLocation}</div>}
                                </div>
                            ))}
                        </div>

                        {/* Mobile List */}
                        <div className="pkg-list-mobile">
                            {filtered.map(pkg => (
                                <div key={pkg._id} className="pkg-card-mobile">
                                    <div className="pkg-mobile-header">
                                        <div>
                                            <div className="pkg-mobile-title">{pkg.guestName}</div>
                                            <Badge bg={pkg.status === 'Received' ? 'warning' : pkg.status === 'Notified' ? 'info' : 'success'}>
                                                {pkg.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="pkg-mobile-details">
                                        <div>🚪 Room {pkg.room}</div>
                                        {pkg.carrier && <div>📮 {pkg.carrier}</div>}
                                        <div>📅 {new Date(pkg.receivedDate).toLocaleDateString()}</div>
                                        {pkg.storageLocation && <div>🗄️ {pkg.storageLocation}</div>}
                                    </div>
                                    <div className="pkg-mobile-actions">
                                        {pkg.status === 'Received' && (
                                            <button onClick={() => handleNotify(pkg)}>Notify</button>
                                        )}
                                        {(pkg.status === 'Received' || pkg.status === 'Notified') && (
                                            <button onClick={() => handlePickup(pkg)}>Picked Up</button>
                                        )}
                                        <button onClick={() => handleEdit(pkg)}>Edit</button>
                                        <button onClick={() => handleDelete(pkg._id)} className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Notify Modal */}
            <Modal show={showNotify} onHide={() => setShowNotify(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Notify Guest</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPackage && (
                        <div>
                            <p><strong>Guest:</strong> {selectedPackage.guestName} (Room {selectedPackage.room})</p>
                            <Form onSubmit={handleSubmitNotify}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Notification Method</Form.Label>
                                    <Form.Select 
                                        value={notifyMethod}
                                        onChange={(e) => setNotifyMethod(e.target.value)}
                                    >
                                        <option>Phone</option>
                                        <option>Email</option>
                                        <option>Room Note</option>
                                        <option>AI Concierge</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button type="submit" variant="primary">Mark as Notified</Button>
                            </Form>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Pickup Modal */}
            <Modal show={showPickup} onHide={() => setShowPickup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Package Picked Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPackage && (
                        <div>
                            <p><strong>Package for:</strong> {selectedPackage.guestName} (Room {selectedPackage.room})</p>
                            <Form onSubmit={handleSubmitPickup}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Signed By</Form.Label>
                                    <Form.Control 
                                        value={signedBy}
                                        onChange={(e) => setSignedBy(e.target.value)}
                                        placeholder="Guest name"
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary">Confirm Pickup</Button>
                            </Form>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}
