import TaskListItem from "../TaskListItem/TaskListItem";
import { Table } from "react-bootstrap";


export default function TaskList({ tasks, handleDelete, handleToggleStatus, currentUser }) {
    if (!tasks.length) {
        return <div className="empty-state">No tasks match your filters yet.</div>;
    }
    return (
        <Table hover responsive className="align-middle mb-0 task-table">
            <thead>
                <tr>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Department</th>
                    <th>Room</th>
                    <th>Assignee</th>
                    <th>Task</th>
                    <th className="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task, index) => (
                    <TaskListItem key={task._id || index} task={task} handleDelete={handleDelete} handleToggleStatus={handleToggleStatus} currentUser={currentUser} />
                ))}
            </tbody>
        </Table>
    );
}
