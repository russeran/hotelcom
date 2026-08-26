import "./ComplaintListItems.css";
import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import ComplaintUpdate from "../ComplaintUpdate/ComplaintUpdate";
import StatusBadge from "../StatusBadge/StatusBadge";

function formatDate(value) {
    if (!value) return '';
    const d = new Date(value);
    return isNaN(d) ? value : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ComplaintListItem({ complaint, handleDelete, updateComplaint, currentUser }) {
    const [editing, setEditing] = useState(false);
    const privileged = !!currentUser && ['manager', 'admin'].includes(currentUser.role);
    const owner = !!currentUser && complaint.user && complaint.user.toString() === currentUser._id;
    const canDelete = privileged || owner;

    return (
        <Card className="complaint-card">
            <Card.Body>
                <div className="complaint-card-head">
                    <div>
                        <div className="complaint-room">Room {complaint.room}</div>
                        <div className="complaint-guest">{complaint.name}</div>
                    </div>
                    <StatusBadge status={complaint.status} />
                </div>
                {complaint.department && <div className="complaint-dept">{complaint.department}</div>}

                <div className="complaint-field">
                    <span className="field-label">Issue</span>
                    <span className="field-value">{complaint.issue || '—'}</span>
                </div>
                <div className="complaint-field">
                    <span className="field-label">Solution</span>
                    <span className="field-value">{complaint.solution || '—'}</span>
                </div>

                <div className="complaint-meta">{formatDate(complaint.date)}</div>

                <div className="complaint-actions">
                    <Button size="sm" variant="outline-secondary" onClick={() => setEditing(!editing)}>
                        {editing ? 'Close' : 'Edit'}
                    </Button>
                    {canDelete && (
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(complaint._id)}>
                            Delete
                        </Button>
                    )}
                </div>

                {editing && (
                    <div className="complaint-edit">
                        <ComplaintUpdate
                            complaint={complaint}
                            updateComplaint={updateComplaint}
                            onClose={() => setEditing(false)}
                        />
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}
