import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Badge, Modal } from 'react-bootstrap';
import * as lostAndFoundAPI from '../../utilities/lostAndFound-api';
import './LostAndFoundPage.css';

const BLANK_FORM = {
    itemDescription: '',
    category: 'Personal Items',
    location: '',
    room: '',
    dateFound: new Date().toISOString().split('T')[0],
    storageLocation: '',
    guestName: '',
    guestRoom: '',
    guestContact: '',
    notes: ''
};

export default function LostAndFoundPage() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(BLANK_FORM);
    const [editingId, setEditingId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showClaim, setShowClaim] = useState(false);
    const [claimForm, setClaimForm] = useState({ claimedBy: '', claimNotes: '' });

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        const data = await lostAndFoundAPI.getAllItems();
        setItems(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                const updated = await lostAndFoundAPI.updateItem(editingId, form);
                setItems(items.map(item => item._id === editingId ? updated : item));
            } else {
                const created = await lostAndFoundAPI.createItem(form);
                setItems([created, ...items]);
            }
            setForm(BLANK_FORM);
            setEditingId(null);
            setShowForm(false);
        } catch (err) {
            console.error('Failed to save item:', err);
        }
    }

    function handleEdit(item) {
        setForm({
            itemDescription: item.itemDescription || '',
            category: item.category || 'Personal Items',
            location: item.location || '',
            room: item.room || '',
            dateFound: item.dateFound ? new Date(item.dateFound).toISOString().split('T')[0] : '',
            storageLocation: item.storageLocation || '',
            guestName: item.guestName || '',
            guestRoom: item.guestRoom || '',
            guestContact: item.guestContact || '',
            notes: item.notes || ''
        });
        setEditingId(item._id);
        setShowForm(true);
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this item?')) return;
        await lostAndFoundAPI.deleteItem(id);
        setItems(items.filter(item => item._id !== id));
    }

    function handleClaimItem(item) {
        setSelectedItem(item);
        setShowClaim(true);
    }

    async function handleSubmitClaim(e) {
        e.preventDefault();
        const updated = await lostAndFoundAPI.claimItem(selectedItem._id, claimForm);
        setItems(items.map(item => item._id === updated._id ? updated : item));
        setShowClaim(false);
        setClaimForm({ claimedBy: '', claimNotes: '' });
    }

    const filtered = items.filter(item => {
        const matchesFilter = filter === 'all' || item.status === filter;
        const matchesSearch = search === '' ||
            item.itemDescription.toLowerCase().includes(search.toLowerCase()) ||
            (item.location && item.location.toLowerCase().includes(search.toLowerCase())) ||
            (item.room && item.room.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const unclaimedCount = items.filter(i => i.status === 'Unclaimed').length;

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">🔍 Lost & Found</h1>
                    <p className="section-subtitle">{unclaimedCount} unclaimed · {items.length} total</p>
                </div>
                <button 
                    className="lf-add-btn"
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(BLANK_FORM); }}
                >
                    {showForm ? '✕ Cancel' : '+ Report Item'}
                </button>
            </header>

            {showForm && (
                <div className="surface-card page-card">
                    <h3 className="form-title">{editingId ? 'Edit Item' : 'Report Lost Item'}</h3>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={8}>
                                <Form.Label>Item Description *</Form.Label>
                                <Form.Control 
                                    value={form.itemDescription}
                                    onChange={(e) => setForm({ ...form, itemDescription: e.target.value })}
                                    placeholder="e.g., Black leather wallet"
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Category *</Form.Label>
                                <Form.Select 
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    required
                                >
                                    <option>Clothing</option>
                                    <option>Electronics</option>
                                    <option>Jewelry</option>
                                    <option>Documents</option>
                                    <option>Keys</option>
                                    <option>Bags</option>
                                    <option>Personal Items</option>
                                    <option>Other</option>
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Label>Location Found *</Form.Label>
                                <Form.Control 
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    placeholder="e.g., Lobby, Pool area"
                                    required
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Room (if applicable)</Form.Label>
                                <Form.Control 
                                    value={form.room}
                                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                                    placeholder="e.g., 305"
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Date Found *</Form.Label>
                                <Form.Control 
                                    type="date"
                                    value={form.dateFound}
                                    onChange={(e) => setForm({ ...form, dateFound: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Storage Location</Form.Label>
                                <Form.Control 
                                    value={form.storageLocation}
                                    onChange={(e) => setForm({ ...form, storageLocation: e.target.value })}
                                    placeholder="e.g., Front desk drawer 2"
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Guest Name (if known)</Form.Label>
                                <Form.Control 
                                    value={form.guestName}
                                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Guest Contact</Form.Label>
                                <Form.Control 
                                    value={form.guestContact}
                                    onChange={(e) => setForm({ ...form, guestContact: e.target.value })}
                                    placeholder="Phone or email"
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Label>Notes</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    rows={2}
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    placeholder="Additional details..."
                                />
                            </Col>
                        </Row>
                        <div className="form-actions">
                            <Button type="submit" variant="primary">
                                {editingId ? 'Update Item' : 'Report Item'}
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
                        placeholder="🔍 Search items or locations..."
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
                            className={`pill ${filter === 'Unclaimed' ? 'active' : ''}`}
                            onClick={() => setFilter('Unclaimed')}
                        >
                            Unclaimed
                        </button>
                        <button 
                            className={`pill ${filter === 'Claimed' ? 'active' : ''}`}
                            onClick={() => setFilter('Claimed')}
                        >
                            Claimed
                        </button>
                        <button 
                            className={`pill ${filter === 'Disposed' ? 'active' : ''}`}
                            onClick={() => setFilter('Disposed')}
                        >
                            Disposed
                        </button>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        {search || filter !== 'all' ? 'No items match your filters' : 'No lost items yet. Click "+ Report Item" to add one.'}
                    </div>
                ) : (
                    <>
                        {/* Desktop Grid */}
                        <div className="lf-grid-desktop">
                            {filtered.map(item => (
                                <div key={item._id} className="lf-card">
                                    <div className="lf-card-header">
                                        <div>
                                            <h4 className="lf-card-title">{item.itemDescription}</h4>
                                            <Badge bg={item.status === 'Unclaimed' ? 'warning' : item.status === 'Claimed' ? 'success' : 'secondary'}>
                                                {item.status}
                                            </Badge>
                                            <Badge bg="secondary" className="ms-1">{item.category}</Badge>
                                        </div>
                                        <div className="lf-card-actions">
                                            {item.status === 'Unclaimed' && (
                                                <button onClick={() => handleClaimItem(item)} title="Mark as claimed">✅</button>
                                            )}
                                            <button onClick={() => handleEdit(item)} title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(item._id)} title="Delete">🗑️</button>
                                        </div>
                                    </div>
                                    <div className="lf-card-detail">📍 {item.location} {item.room && `(Room ${item.room})`}</div>
                                    <div className="lf-card-detail">📅 Found: {new Date(item.dateFound).toLocaleDateString()}</div>
                                    {item.storageLocation && <div className="lf-card-detail">🗄️ Storage: {item.storageLocation}</div>}
                                    {item.guestName && <div className="lf-card-detail">👤 Guest: {item.guestName}</div>}
                                </div>
                            ))}
                        </div>

                        {/* Mobile List */}
                        <div className="lf-list-mobile">
                            {filtered.map(item => (
                                <div key={item._id} className="lf-card-mobile">
                                    <div className="lf-mobile-header">
                                        <div>
                                            <div className="lf-mobile-title">{item.itemDescription}</div>
                                            <div className="lf-mobile-badges">
                                                <Badge bg={item.status === 'Unclaimed' ? 'warning' : item.status === 'Claimed' ? 'success' : 'secondary'}>
                                                    {item.status}
                                                </Badge>
                                                <Badge bg="secondary">{item.category}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lf-mobile-details">
                                        <div>📍 {item.location} {item.room && `(Room ${item.room})`}</div>
                                        <div>📅 {new Date(item.dateFound).toLocaleDateString()}</div>
                                        {item.storageLocation && <div>🗄️ {item.storageLocation}</div>}
                                    </div>
                                    <div className="lf-mobile-actions">
                                        {item.status === 'Unclaimed' && (
                                            <button onClick={() => handleClaimItem(item)}>Claim</button>
                                        )}
                                        <button onClick={() => handleEdit(item)}>Edit</button>
                                        <button onClick={() => handleDelete(item._id)} className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Claim Modal */}
            <Modal show={showClaim} onHide={() => setShowClaim(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Mark Item as Claimed</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedItem && (
                        <div>
                            <p><strong>Item:</strong> {selectedItem.itemDescription}</p>
                            <Form onSubmit={handleSubmitClaim}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Claimed By</Form.Label>
                                    <Form.Control 
                                        value={claimForm.claimedBy}
                                        onChange={(e) => setClaimForm({ ...claimForm, claimedBy: e.target.value })}
                                        placeholder="Guest name"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Claim Notes</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={2}
                                        value={claimForm.claimNotes}
                                        onChange={(e) => setClaimForm({ ...claimForm, claimNotes: e.target.value })}
                                        placeholder="Verification details, etc."
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary">Confirm Claim</Button>
                            </Form>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}
