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
    
    function addTask(task) {
        tasksAPI.addATask(task);
        setTasks([...tasks, task]);
    
    }
    return (
        <div className="task-page">
            <br />
            <strong><h2>TASKS</h2></strong>
            <TaskForm addTask={addTask} />
            <TaskList tasks={tasks} />
        </div>
    );
    }