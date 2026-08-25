import { Badge } from "react-bootstrap";

const VARIANTS = {
    open: 'warning',
    new: 'warning',
    pending: 'warning',
    'in progress': 'info',
    progress: 'info',
    working: 'info',
    done: 'success',
    resolved: 'success',
    complete: 'success',
    completed: 'success',
    closed: 'secondary',
    cancelled: 'secondary',
};

export default function StatusBadge({ status }) {
    const key = (status || '').toString().trim().toLowerCase();
    const variant = VARIANTS[key] || 'secondary';
    return (
        <Badge bg={variant} className="status-badge text-uppercase">
            {status || 'N/A'}
        </Badge>
    );
}
