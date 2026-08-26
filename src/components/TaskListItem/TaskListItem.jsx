import './TaskListItem.css'
import { Button } from "react-bootstrap";
import StatusBadge from "../StatusBadge/StatusBadge";
import PriorityBadge from "../PriorityBadge/PriorityBadge";

export default function TaskListItem({ task, handleDelete, handleToggleStatus, currentUser }) {
    const done = task.status === 'Done';
    const role = currentUser && currentUser.role;
    // Admins delete any task; managers only within their own department.
    const canManage = role === 'admin' || (role === 'manager' && task.department === currentUser.department);
    return (
        <tr>
            <td><PriorityBadge priority={task.priority} /></td>
            <td><StatusBadge status={task.status} /></td>
            <td>{task.department}</td>
            <td>{task.room}</td>
            <td>{task.user}</td>
            <td>{task.task}</td>
            <td className="text-end text-nowrap">
                <Button
                    size="sm"
                    variant={done ? 'outline-secondary' : 'success'}
                    onClick={() => handleToggleStatus(task)}
                >
                    {done ? 'Reopen' : 'Done'}
                </Button>
                {canManage && (
                    <>
                        {' '}
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(task._id)}>
                            Delete
                        </Button>
                    </>
                )}
            </td>
        </tr>
    );
}
