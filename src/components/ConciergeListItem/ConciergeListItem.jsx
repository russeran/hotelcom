import { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import ConciergeUpdate from "../ConciergeUpdate/ConciergeUpdate";
import "./ConciergeListItem.css"

function mapsHref(address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default function ConciergeListItem({ concierge, handleDelete, updateConcierge }) {
    const [editing, setEditing] = useState(false);

    return (
        <Card className="con-card">
            <Card.Body>
                <div className="con-head">
                    <div>
                        <div className="con-name">{concierge.name}</div>
                        {concierge.type && <Badge bg="info" className="con-type text-uppercase">{concierge.type}</Badge>}
                    </div>
                    {concierge.price !== undefined && concierge.price !== '' && concierge.price !== null && (
                        <div className="con-price">${concierge.price}</div>
                    )}
                </div>

                {concierge.trip && (
                    <div className="con-field"><span className="field-label">Trip</span><span className="field-value">{concierge.trip}</span></div>
                )}
                {concierge.address && (
                    <div className="con-field"><span className="field-label">Address</span><span className="field-value">{concierge.address}</span></div>
                )}
                {concierge.note && (
                    <div className="con-field"><span className="field-label">Note</span><span className="field-value">{concierge.note}</span></div>
                )}

                {(concierge.address || concierge.phone || concierge.url) && (
                    <div className="con-links">
                        {concierge.address && (
                            <a href={mapsHref(concierge.address)} target="_blank" rel="noreferrer" className="con-link">Directions</a>
                        )}
                        {concierge.phone && (
                            <a href={`tel:${concierge.phone}`} className="con-link">Call</a>
                        )}
                        {concierge.url && (
                            <a href={concierge.url} target="_blank" rel="noreferrer" className="con-link">Website</a>
                        )}
                    </div>
                )}

                <div className="con-actions">
                    <Button size="sm" variant="outline-secondary" onClick={() => setEditing(!editing)}>
                        {editing ? 'Close' : 'Edit'}
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(concierge._id)}>Delete</Button>
                </div>

                {editing && (
                    <div className="con-edit">
                        <ConciergeUpdate
                            concierge={concierge}
                            updateConcierge={updateConcierge}
                            onClose={() => setEditing(false)}
                        />
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}
