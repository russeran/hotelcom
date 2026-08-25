import { useEffect, useState, useMemo } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import ComplaintForm from '../../components/ComplaintForm/ComplaintForm';
import ComplaintList from '../../components/ComplaintList/ComplaintList';
import * as complaintsAPI from '../../utilities/complaints-api';
import './ComplaintPage.css'

const CLOSED = ['done', 'resolved', 'complete', 'completed', 'closed', 'cancelled'];

export default function ComplaintPage() {
    const [complaints, setComplaints] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(function () {
        async function getAllComplaints() {
            let all = await complaintsAPI.getAllComplaints();
            setComplaints(all);
        }
        getAllComplaints();
    }, []);

    async function addComplaint(complaint) {
        const created = await complaintsAPI.addAComplaint(complaint);
        setComplaints([created, ...complaints]);
    }

    async function handleDelete(complaintId) {
        await complaintsAPI.deleteAComplaint(complaintId);
        setComplaints(complaints.filter(complaint => complaint._id !== complaintId));
    }

    async function updateComplaint(complaintId, updates) {
        const updated = await complaintsAPI.updateComplaint(complaintId, updates);
        setComplaints(complaints.map(c => (c._id === complaintId ? { ...c, ...updated } : c)));
    }

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return complaints.filter(c => {
            const closed = CLOSED.includes((c.status || '').toLowerCase());
            if (filter === 'open' && closed) return false;
            if (filter === 'resolved' && !closed) return false;
            if (!q) return true;
            return [c.name, c.issue, c.solution, c.room, c.status]
                .map(v => (v ?? '').toString().toLowerCase())
                .some(v => v.includes(q));
        });
    }, [complaints, search, filter]);

    const openCount = complaints.filter(c => !CLOSED.includes((c.status || '').toLowerCase())).length;

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">Complaints</h1>
                    <p className="section-subtitle">{openCount} open · {complaints.length} total</p>
                </div>
            </header>

            <div className="surface-card page-card">
                <ComplaintForm addComplaint={addComplaint} />
            </div>

            <div className="toolbar">
                <InputGroup className="search-box">
                    <InputGroup.Text>Search</InputGroup.Text>
                    <Form.Control
                        placeholder="Filter by guest, issue, room, status…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
                <div className="filter-pills">
                    {['all', 'open', 'resolved'].map(f => (
                        <button
                            key={f}
                            className={`pill ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f[0].toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {visible.length === 0 ? (
                <div className="surface-card page-card empty-state">No complaints match your filters. Nice work!</div>
            ) : (
                <ComplaintList complaints={visible} handleDelete={handleDelete} updateComplaint={updateComplaint} />
            )}
        </div>
    );
}
