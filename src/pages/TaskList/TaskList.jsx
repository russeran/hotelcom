import TaskListItem from "../../components/TaskListItem/TaskListItem";
import { Table } from "react-bootstrap";


export default function TaskList({ tasks }) {
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
                    </tr>
                </thead>
                {tasks.map((task, index) => (
                <TaskListItem  key={index}  task={task} index={index} />
                ))}
            </Table>
        </div>
    );
}