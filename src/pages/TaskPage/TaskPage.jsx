import {useEffect, useState} from 'react';
import TaskForm from '../../components/TaskForm/TaskForm';
import TaskList from '../../components/TaskList/TaskList';
import * as tasksAPI from '../../utilities/tasks-api';
import './TaskPage.css';

export default function TaskPage() {
    const [tasks, setTasks] = useState([]);
    
    useEffect(function(){
        async function getAllTasks(){
        let users = await tasksAPI.getAllTasks();
        setTasks(users);
        }
        getAllTasks();
    },[] );
    
    async function addTask(task) {
        const newTask = await tasksAPI.addATask(task);
        setTasks([...tasks, newTask]);
    }

    async function handleDelete(taskId) {
        await tasksAPI.deleteATask(taskId);
        setTasks(tasks.filter(task => task._id !== taskId));
    }

    async function handleToggleStatus(task) {
        const nextStatus = task.status === 'Done' ? 'Open' : 'Done';
        const updatedTask = await tasksAPI.updateATask(task._id, { status: nextStatus });
        setTasks(tasks.map(t => (t._id === task._id ? updatedTask : t)));
    }

    return (
        <>
        <strong><h2 id='task-h2'>TASKS</h2></strong>
        <div>
        <TaskForm addTask={addTask} />
        <div className="task-page">
            <br />
            
            
            <TaskList tasks={tasks} handleDelete={handleDelete} handleToggleStatus={handleToggleStatus} />
        </div>
        </div>
        </>
    );
    }