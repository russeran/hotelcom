import { useEffect, useState, useMemo } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import ConciergeForm from '../../components/ConciergeForm/ConciergeForm';
import ConciergeList from '../../components/ConciergeList/ConciergeList';
import EventsNearby from '../../components/EventsNearby/EventsNearby';
import * as conciergesAPI from '../../utilities/concierges-api';
import { canManage } from '../../utilities/users-service';
import './ConciergePage.css';

export default function ConciergePage() {
    const [concierges, setConcierges] = useState([]);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(function () {
        async function getAllConcierges() {
            let all = await conciergesAPI.getAllConcierges();
            setConcierges(all);
        }
        getAllConcierges();
    }, []);

    async function addConcierge(concierge) {
        const created = await conciergesAPI.addAConcierge(concierge);
        setConcierges([created, ...concierges]);
    }

    async function handleDelete(conciergeId) {
        await conciergesAPI.deleteAConcierge(conciergeId);
        setConcierges(concierges.filter(concierge => concierge._id !== conciergeId));
    }

    async function updateConcierge(conciergeId, updates) {
        const updated = await conciergesAPI.updateAConcierge(conciergeId, updates);
        setConcierges(concierges.map(c => (c._id === conciergeId ? { ...c, ...updated } : c)));
    }

    const types = useMemo(() => {
        const set = new Set(concierges.map(c => (c.type || '').trim()).filter(Boolean));
        return ['all', ...Array.from(set)];
    }, [concierges]);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return concierges.filter(c => {
            if (typeFilter !== 'all' && (c.type || '').toLowerCase() !== typeFilter.toLowerCase()) return false;
            if (!q) return true;
            return [c.name, c.type, c.trip, c.note, c.address]
                .map(v => (v ?? '').toString().toLowerCase())
                .some(v => v.includes(q));
        });
    }, [concierges, search, typeFilter]);

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">Concierge</h1>
                    <p className="section-subtitle">{concierges.length} local recommendation{concierges.length === 1 ? '' : 's'}</p>
                </div>
            </header>

            <h2 className="subsection-title">Events Happening Nearby</h2>
            <p className="section-subtitle events-subtitle">Auto-updated live from local venues · save any to your recommendations</p>
            <EventsNearby onSave={addConcierge} />

            <h2 className="subsection-title mt-4">Local Recommendations</h2>
            <div className="surface-card page-card">
                <ConciergeForm addConcierge={addConcierge} />
            </div>

            <div className="toolbar">
                <InputGroup className="search-box">
                    <InputGroup.Text>Search</InputGroup.Text>
                    <Form.Control
                        placeholder="Filter by name, type, note, address…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
                {types.length > 1 && (
                    <div className="filter-pills">
                        {types.map(t => (
                            <button
                                key={t}
                                className={`pill ${typeFilter === t ? 'active' : ''}`}
                                onClick={() => setTypeFilter(t)}
                            >
                                {t === 'all' ? 'All' : t}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {visible.length === 0 ? (
                <div className="surface-card page-card empty-state">No recommendations match your filters.</div>
            ) : (
                <ConciergeList concierges={visible} handleDelete={handleDelete} updateConcierge={updateConcierge} canManage={canManage()} />
            )}
        </div>
    );
}
