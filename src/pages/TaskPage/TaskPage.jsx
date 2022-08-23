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
        <>
        <strong><h2>TASKS</h2></strong>
        <div>
        <TaskForm addTask={addTask} />
        <div className="task-page">
            <br />
            
            
            <TaskList tasks={tasks} />
        </div>
        </div>
        </>
    );
    }