import TaskListItem from "../TaskListItem/TaskListItem";
import { Table } from "react-bootstrap";


export default function TaskList({ tasks, handleDelete, handleToggleStatus }) {
    return (
        <div >
  
            <br />
             <Table striped bordered hover  className="task-table" >
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Department</th>
                        <th>Room</th>
                        <th>User</th>
                        <th>Task</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                {tasks.map((task, index) => (
                <TaskListItem  key={task._id || index}  task={task} index={index} handleDelete={handleDelete} handleToggleStatus={handleToggleStatus} />
                ))}
            </Table>
        </div>
    );
}
