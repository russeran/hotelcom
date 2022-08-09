import './TaskListItem.css' 

export default function TaskListItem({ task }) {
    return (
        <tbody>
            <tr>
                <td>{task.status}</td>
                <td>{task.date}</td>
                <td>{task.department}</td>
                <td>{task.room}</td>
                <td>{task.user}</td>
                <td>{task.task}</td>
            </tr>
        </tbody>
    );
}