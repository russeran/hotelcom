import { useEffect, useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import * as eventsAPI from '../../utilities/events-api';
import './EventsNearby.css';

function formatWhen(date, time) {
    if (!date) return '';
    const d = new Date(`${date}T${time || '00:00:00'}`);
    if (isNaN(d)) return date;
    const opts = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateStr = d.toLocaleDateString(undefined, opts);
    return time ? `${dateStr} · ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}` : dateStr;
}

export default function EventsNearby({ onSave }) {
    const [state, setState] = useState({ loading: true, configured: true, events: [], error: '' });
    const [savedIds, setSavedIds] = useState([]);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const data = await eventsAPI.getNearbyEvents();
                if (active) setState({ loading: false, configured: data.configured, events: data.events || [], error: data.error || '' });
            } catch {
                if (active) setState({ loading: false, configured: true, events: [], error: 'Could not load events' });
            }
        })();
        return () => { active = false; };
    }, []);

    async function handleSave(ev) {
        if (!onSave) return;
        await onSave({
            type: ev.category || 'Event',
            name: ev.name,
            price: '',
            trip: [ev.venue, formatWhen(ev.date, ev.time)].filter(Boolean).join(' · '),
            address: [ev.venue, ev.city].filter(Boolean).join(', '),
            url: ev.url,
            note: ev.priceRange ? `Tickets ${ev.priceRange}` : 'Live event nearby'
        });
        setSavedIds(ids => [...ids, ev.id]);
    }

    if (state.loading) {
        return <div className="surface-card page-card muted">Loading nearby events…</div>;
    }

    if (!state.configured) {
        return (
            <div className="surface-card page-card events-unconfigured">
                <strong>Nearby events are ready to switch on.</strong>
                <p className="muted mb-0">
                    Add a <code>TICKETMASTER_API_KEY</code> secret to auto-list concerts, sports, and shows happening near the hotel.
                </p>
            </div>
        );
    }

    if (state.error) {
        return <div className="surface-card page-card muted">Couldn’t load nearby events right now. Please try again later.</div>;
    }

    if (!state.events.length) {
        return <div className="surface-card page-card muted">No upcoming events found nearby.</div>;
    }

    return (
        <div className="events-grid">
            {state.events.map(ev => (
                <div key={ev.id} className="event-card surface-card">
                    {ev.image && <div className="event-image" style={{ backgroundImage: `url(${ev.image})` }} />}
                    <div className="event-body">
                        {ev.category && <Badge bg="info" className="event-cat text-uppercase">{ev.category}</Badge>}
                        <div className="event-name">{ev.name}</div>
                        <div className="event-when">{formatWhen(ev.date, ev.time)}</div>
                        {ev.venue && <div className="event-venue muted">{ev.venue}{ev.city ? `, ${ev.city}` : ''}</div>}
                        <div className="event-footer">
                            {ev.priceRange && <span className="event-price">{ev.priceRange}</span>}
                            <div className="event-actions">
                                {onSave && (
                                    <Button size="sm" variant="outline-secondary" disabled={savedIds.includes(ev.id)} onClick={() => handleSave(ev)}>
                                        {savedIds.includes(ev.id) ? 'Saved' : 'Save'}
                                    </Button>
                                )}
                                {ev.url && (
                                    <a className="btn btn-sm btn-primary" href={ev.url} target="_blank" rel="noreferrer">Tickets</a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
