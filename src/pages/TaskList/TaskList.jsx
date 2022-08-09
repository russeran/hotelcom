import TaskListItem from "../../components/TaskListItem/TaskListItem";
import { Table } from "react-bootstrap";

export default function TaskList({ tasks }) {
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Department</th>
                        <th>Room</th>
                        <th>User</th>
                        <th>Task</th>
                    </tr>
                </thead>
                {tasks.map((task, index) => (
                <TaskListItem  key={index}  task={task} index={index} />
                ))}
            </Table>
        </div>
    );
}