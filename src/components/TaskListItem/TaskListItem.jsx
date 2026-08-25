import './TaskListItem.css'
import { Button } from "react-bootstrap";

export default function TaskListItem({ task, handleDelete, handleToggleStatus }) {
    return (
        <tbody>
            <tr>
                <td>{task.status}</td>
                <td>{task.date}</td>
                <td>{task.department}</td>
                <td>{task.room}</td>
                <td>{task.user}</td>
                <td>{task.task}</td>
                <td>
                    <Button
                        size="sm"
                        variant={task.status === 'Done' ? 'secondary' : 'success'}
                        onClick={() => handleToggleStatus(task)}
                    >
                        {task.status === 'Done' ? 'Reopen' : 'Done'}
                    </Button>
                    {' '}
                    <Button size="sm" variant="danger" onClick={() => handleDelete(task._id)}>
                        Delete
                    </Button>
                </td>
            </tr>
        </tbody>
    );
}
