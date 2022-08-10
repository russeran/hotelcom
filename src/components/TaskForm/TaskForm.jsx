import './TaskForm.css';
import { useState } from 'react';

export default function TaskForm ({
    addTask }) {

const [newTask, setNewTask] = useState({
    status: '',
    date: '',
    department: '',
    room: '',
    user: '',
    task: '',

    });


    
  

    function handleAddTask(e) {
        e.preventDefault();
        addTask(newTask);
        setNewTask({
            status: '',
            date: '',
            department: '',
            room: '',
            user: '',
            task: '',
        });
    }

    function handleInputChange(e) {
        const addNewTask = { ...newTask,
            [e.target.name]: e.target.value
        };
        
        setNewTask(addNewTask)
    }



    return (
        <form onSubmit={handleAddTask}>
            <table  id="new-task" >

                <tr>
                
                <th className="form-item">
                    <label>Status</label>
                    <input type="text" name="status" value={newTask.status} onChange={handleInputChange} required />
                </th>
                <th className="form-item">
                    <label>Date</label>
                    <input type="text" name="date" value={newTask.date} onChange={handleInputChange} required />
                </th>
                <th className="form-item">
                    <label>Department</label>
                    <input type="text" name="department" value={newTask.department} onChange={handleInputChange} required />
                </th>
                <th className="form-item">
                    <label>Room</label>
                    <input type="text" name="room" value={newTask.room} onChange={handleInputChange} />
                </th>
                <th className="form-item">
                    <label>User</label>
                    <input type="text" name="user" value={newTask.user} onChange={handleInputChange} required />
                </th>
                <th className="form-item">
                    <label>Task</label>
                    <input type="text" name="task" value={newTask.task} onChange={handleInputChange} required />
                </th>
                <br />
                <th className="form-item">
                    <button type="submit">Add Task</button>
                </th>
                </tr>
            </table>
        </form>
    );
}