import { Badge } from "react-bootstrap";

const VARIANTS = {
    urgent: 'danger',
    high: 'warning',
    normal: 'secondary',
    low: 'info',
};

export const PRIORITY_RANK = { urgent: 0, high: 1, normal: 2, low: 3 };

export default function PriorityBadge({ priority }) {
    const key = (priority || 'Normal').toString().trim().toLowerCase();
    const variant = VARIANTS[key] || 'secondary';
    return (
        <Badge bg={variant} className="status-badge text-uppercase">
            {priority || 'Normal'}
        </Badge>
    );
}
