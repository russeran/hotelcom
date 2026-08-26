import './TaskListItem.css'
import { Button, Form } from "react-bootstrap";
import StatusBadge from "../StatusBadge/StatusBadge";
import PriorityBadge from "../PriorityBadge/PriorityBadge";

const CLOSED = ['done', 'resolved', 'complete', 'completed', 'closed', 'cancelled'];
// SLA windows (hours) after which an open task of a given priority is overdue.
const SLA_HOURS = { urgent: 1, high: 4, normal: 24, low: 72 };
const STATUSES = ['Open', 'Acknowledged', 'In Progress', 'Done'];

function isOverdue(task) {
    if (CLOSED.includes((task.status || '').toLowerCase())) return false;
    const limit = SLA_HOURS[(task.priority || 'normal').toLowerCase()] ?? 24;
    const created = new Date(task.createdAt || task.date).getTime();
    if (isNaN(created)) return false;
    return (Date.now() - created) > limit * 3600 * 1000;
}

export default function TaskListItem({ task, handleDelete, handleUpdateStatus, handleAcknowledge, currentUser }) {
    const role = currentUser && currentUser.role;
    const canManage = role === 'admin' || (role === 'manager' && task.department === currentUser.department);
    const overdue = isOverdue(task);

    return (
        <tr className={overdue ? 'task-overdue' : ''}>
            <td>
                <PriorityBadge priority={task.priority} />
                {overdue && <span className="overdue-badge">OVERDUE</span>}
            </td>
            <td>
                <Form.Select
                    size="sm"
                    className="status-select"
                    aria-label={`Status for task: ${task.task}`}
                    value={STATUSES.includes(task.status) ? task.status : 'Open'}
                    onChange={(e) => handleUpdateStatus(task, e.target.value)}
                >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </Form.Select>
            </td>
            <td>{task.department}</td>
            <td>{task.room}</td>
            <td>
                {task.user}
                {task.acknowledgedBy && <div className="ack-note">✓ ack by {task.acknowledgedBy}</div>}
            </td>
            <td>{task.task}</td>
            <td className="text-end text-nowrap">
                {task.status === 'Open' && (
                    <>
                        <Button size="sm" variant="outline-primary" onClick={() => handleAcknowledge(task)}>Acknowledge</Button>
                        {' '}
                    </>
                )}
                {canManage && (
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(task._id)}>Delete</Button>
                )}
            </td>
        </tr>
    );
}
