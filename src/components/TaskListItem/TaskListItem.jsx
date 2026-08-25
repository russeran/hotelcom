import './TaskListItem.css'
import { Button } from "react-bootstrap";
import StatusBadge from "../StatusBadge/StatusBadge";

export default function TaskListItem({ task, handleDelete, handleToggleStatus }) {
    const done = task.status === 'Done';
    return (
        <tr>
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
                {' '}
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(task._id)}>
                    Delete
                </Button>
            </td>
        </tr>
    );
}
