import { Card, Button, Badge } from "react-bootstrap";
import "./ConciergeListItem.css"

export default function ConciergeListItem({ concierge, handleDelete }) {
    return (
        <Card className="con-card">
            <Card.Body>
                <div className="con-head">
                    <div>
                        <div className="con-name">{concierge.name}</div>
                        {concierge.type && <Badge bg="info" className="con-type text-uppercase">{concierge.type}</Badge>}
                    </div>
                    {concierge.price && <div className="con-price">${concierge.price}</div>}
                </div>

                {concierge.trip && (
                    <div className="con-field"><span className="field-label">Trip</span><span className="field-value">{concierge.trip}</span></div>
                )}
                {concierge.note && (
                    <div className="con-field"><span className="field-label">Note</span><span className="field-value">{concierge.note}</span></div>
                )}

                <div className="con-actions">
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(concierge._id)}>Delete</Button>
                </div>
            </Card.Body>
        </Card>
    );
}
