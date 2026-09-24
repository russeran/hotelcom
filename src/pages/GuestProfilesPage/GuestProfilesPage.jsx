import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Modal, Badge } from 'react-bootstrap';
import * as guestProfilesAPI from '../../utilities/guestProfiles-api';
import './GuestProfilesPage.css';

const BLANK_FORM = {
    name: '',
    email: '',
    phone: '',
    roomPreferences: { floor: '', view: '', bedType: '', temperature: '' },
    specialRequests: [],
    allergies: [],
    dietaryRestrictions: [],
    vipStatus: 'Regular'
};

export default function GuestProfilesPage() {
    const [profiles, setProfiles] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(BLANK_FORM);
    const [editingId, setEditingId] = useState(null);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [note, setNote] = useState('');

    useEffect(() => {
        loadProfiles();
    }, []);

    async function loadProfiles() {
        const data = await guestProfilesAPI.getAllProfiles();
        setProfiles(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                const updated = await guestProfilesAPI.updateProfile(editingId, form);
                setProfiles(profiles.map(p => p._id === editingId ? updated : p));
            } else {
                const created = await guestProfilesAPI.createProfile(form);
                setProfiles([created, ...profiles]);
            }
            setForm(BLANK_FORM);
            setEditingId(null);
            setShowForm(false);
        } catch (err) {
            console.error('Failed to save profile:', err);
        }
    }

    function handleEdit(profile) {
        setForm({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            roomPreferences: profile.roomPreferences || { floor: '', view: '', bedType: '', temperature: '' },
            specialRequests: profile.specialRequests || [],
            allergies: profile.allergies || [],
            dietaryRestrictions: profile.dietaryRestrictions || [],
            vipStatus: profile.vipStatus || 'Regular'
        });
        setEditingId(profile._id);
        setShowForm(true);
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this guest profile?')) return;
        await guestProfilesAPI.deleteProfile(id);
        setProfiles(profiles.filter(p => p._id !== id));
    }

    async function handleViewDetails(profile) {
        setSelectedProfile(profile);
        setShowDetails(true);
    }

    async function handleAddNote() {
        if (!note.trim()) return;
        const updated = await guestProfilesAPI.addNote(selectedProfile._id, note);
        setSelectedProfile(updated);
        setProfiles(profiles.map(p => p._id === updated._id ? updated : p));
        setNote('');
    }

    function handleArrayInput(field, value) {
        const items = value.split(',').map(s => s.trim()).filter(Boolean);
        setForm({ ...form, [field]: items });
    }

    const filtered = profiles.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.email && p.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">👤 Guest Profiles</h1>
                    <p className="section-subtitle">{profiles.length} profile{profiles.length !== 1 ? 's' : ''}</p>
                </div>
                <button 
                    className="profile-add-btn"
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(BLANK_FORM); }}
                >
                    {showForm ? '✕ Cancel' : '+ New Profile'}
                </button>
            </header>

            {showForm && (
                <div className="surface-card page-card">
                    <h3 className="form-title">{editingId ? 'Edit Profile' : 'New Guest Profile'}</h3>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Label>Guest Name *</Form.Label>
                                <Form.Control 
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control 
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>VIP Status</Form.Label>
                                <Form.Select 
                                    value={form.vipStatus}
                                    onChange={(e) => setForm({ ...form, vipStatus: e.target.value })}
                                >
                                    <option>Regular</option>
                                    <option>Silver</option>
                                    <option>Gold</option>
                                    <option>Platinum</option>
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Label>Preferred Floor</Form.Label>
                                <Form.Control 
                                    value={form.roomPreferences.floor}
                                    onChange={(e) => setForm({ ...form, roomPreferences: { ...form.roomPreferences, floor: e.target.value } })}
                                    placeholder="e.g., High floor"
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>View Preference</Form.Label>
                                <Form.Control 
                                    value={form.roomPreferences.view}
                                    onChange={(e) => setForm({ ...form, roomPreferences: { ...form.roomPreferences, view: e.target.value } })}
                                    placeholder="e.g., Ocean view"
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Bed Type</Form.Label>
                                <Form.Control 
                                    value={form.roomPreferences.bedType}
                                    onChange={(e) => setForm({ ...form, roomPreferences: { ...form.roomPreferences, bedType: e.target.value } })}
                                    placeholder="e.g., King"
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Label>Special Requests (comma-separated)</Form.Label>
                                <Form.Control 
                                    value={form.specialRequests.join(', ')}
                                    onChange={(e) => handleArrayInput('specialRequests', e.target.value)}
                                    placeholder="e.g., Extra pillows, Hypoallergenic bedding"
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Allergies (comma-separated)</Form.Label>
                                <Form.Control 
                                    value={form.allergies.join(', ')}
                                    onChange={(e) => handleArrayInput('allergies', e.target.value)}
                                    placeholder="e.g., Peanuts, Shellfish"
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Dietary Restrictions (comma-separated)</Form.Label>
                                <Form.Control 
                                    value={form.dietaryRestrictions.join(', ')}
                                    onChange={(e) => handleArrayInput('dietaryRestrictions', e.target.value)}
                                    placeholder="e.g., Vegan, Gluten-free"
                                />
                            </Col>
                        </Row>
                        <div className="form-actions">
                            <Button type="submit" variant="primary">
                                {editingId ? 'Update Profile' : 'Create Profile'}
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
                        placeholder="🔍 Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        {search ? 'No profiles match your search' : 'No guest profiles yet. Click "+ New Profile" to create one.'}
                    </div>
                ) : (
                    <>
                        {/* Desktop view */}
                        <div className="profiles-grid-desktop">
                            {filtered.map(profile => (
                                <div key={profile._id} className="profile-card">
                                    <div className="profile-card-header">
                                        <div>
                                            <h4 className="profile-card-name">{profile.name}</h4>
                                            <Badge bg="secondary" className="vip-badge">{profile.vipStatus}</Badge>
                                        </div>
                                        <div className="profile-card-actions">
                                            <button onClick={() => handleViewDetails(profile)} title="View details">👁️</button>
                                            <button onClick={() => handleEdit(profile)} title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(profile._id)} title="Delete">🗑️</button>
                                        </div>
                                    </div>
                                    {profile.email && <div className="profile-card-detail">📧 {profile.email}</div>}
                                    {profile.phone && <div className="profile-card-detail">📞 {profile.phone}</div>}
                                    {profile.totalStays > 0 && <div className="profile-card-detail">🏨 {profile.totalStays} stay{profile.totalStays !== 1 ? 's' : ''}</div>}
                                </div>
                            ))}
                        </div>

                        {/* Mobile view */}
                        <div className="profiles-list-mobile">
                            {filtered.map(profile => (
                                <div key={profile._id} className="profile-card-mobile">
                                    <div className="profile-mobile-header">
                                        <div>
                                            <div className="profile-mobile-name">{profile.name}</div>
                                            <Badge bg="secondary" className="vip-badge">{profile.vipStatus}</Badge>
                                        </div>
                                    </div>
                                    <div className="profile-mobile-details">
                                        {profile.email && <div>📧 {profile.email}</div>}
                                        {profile.phone && <div>📞 {profile.phone}</div>}
                                        {profile.totalStays > 0 && <div>🏨 {profile.totalStays} stay{profile.totalStays !== 1 ? 's' : ''}</div>}
                                    </div>
                                    <div className="profile-mobile-actions">
                                        <button onClick={() => handleViewDetails(profile)}>View</button>
                                        <button onClick={() => handleEdit(profile)}>Edit</button>
                                        <button onClick={() => handleDelete(profile._id)} className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Profile Details Modal */}
            <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProfile?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProfile && (
                        <div className="profile-details">
                            <div className="detail-section">
                                <h5>Contact Information</h5>
                                {selectedProfile.email && <p>📧 {selectedProfile.email}</p>}
                                {selectedProfile.phone && <p>📞 {selectedProfile.phone}</p>}
                                <p><Badge bg="secondary">{selectedProfile.vipStatus}</Badge></p>
                            </div>

                            {(selectedProfile.roomPreferences?.floor || selectedProfile.roomPreferences?.view || selectedProfile.roomPreferences?.bedType) && (
                                <div className="detail-section">
                                    <h5>Room Preferences</h5>
                                    {selectedProfile.roomPreferences.floor && <p>🏢 Floor: {selectedProfile.roomPreferences.floor}</p>}
                                    {selectedProfile.roomPreferences.view && <p>🌅 View: {selectedProfile.roomPreferences.view}</p>}
                                    {selectedProfile.roomPreferences.bedType && <p>🛏️ Bed: {selectedProfile.roomPreferences.bedType}</p>}
                                    {selectedProfile.roomPreferences.temperature && <p>🌡️ Temperature: {selectedProfile.roomPreferences.temperature}</p>}
                                </div>
                            )}

                            {selectedProfile.specialRequests?.length > 0 && (
                                <div className="detail-section">
                                    <h5>Special Requests</h5>
                                    <ul>
                                        {selectedProfile.specialRequests.map((req, i) => <li key={i}>{req}</li>)}
                                    </ul>
                                </div>
                            )}

                            {selectedProfile.allergies?.length > 0 && (
                                <div className="detail-section">
                                    <h5>⚠️ Allergies</h5>
                                    <ul>
                                        {selectedProfile.allergies.map((allergy, i) => <li key={i}>{allergy}</li>)}
                                    </ul>
                                </div>
                            )}

                            {selectedProfile.dietaryRestrictions?.length > 0 && (
                                <div className="detail-section">
                                    <h5>🍽️ Dietary Restrictions</h5>
                                    <ul>
                                        {selectedProfile.dietaryRestrictions.map((diet, i) => <li key={i}>{diet}</li>)}
                                    </ul>
                                </div>
                            )}

                            <div className="detail-section">
                                <h5>Stay History</h5>
                                <p>Total Stays: {selectedProfile.totalStays || 0}</p>
                                {selectedProfile.lastStay && <p>Last Stay: {new Date(selectedProfile.lastStay).toLocaleDateString()}</p>}
                            </div>

                            <div className="detail-section">
                                <h5>Staff Notes</h5>
                                {selectedProfile.notes?.length > 0 ? (
                                    <div className="notes-list">
                                        {selectedProfile.notes.map((n, i) => (
                                            <div key={i} className="note-item">
                                                <p>{n.note}</p>
                                                <small>— {n.addedBy} on {new Date(n.date).toLocaleDateString()}</small>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted">No notes yet</p>
                                )}
                                <div className="add-note-section">
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Add a staff note..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                    <Button size="sm" onClick={handleAddNote} disabled={!note.trim()}>Add Note</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}
