import { useEffect, useState, useMemo } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import TaskForm from '../../components/TaskForm/TaskForm';
import TaskList from '../../components/TaskList/TaskList';
import * as tasksAPI from '../../utilities/tasks-api';
import './TaskPage.css';

const CLOSED = ['done', 'resolved', 'complete', 'completed', 'closed', 'cancelled'];

export default function TaskPage() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(function () {
        async function getAllTasks() {
            let all = await tasksAPI.getAllTasks();
            setTasks(all);
        }
        getAllTasks();
    }, []);

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

    const visibleTasks = useMemo(() => {
        const q = search.trim().toLowerCase();
        return tasks.filter(t => {
            const closed = CLOSED.includes((t.status || '').toLowerCase());
            if (filter === 'open' && closed) return false;
            if (filter === 'done' && !closed) return false;
            if (!q) return true;
            return [t.task, t.department, t.user, t.room, t.status]
                .map(v => (v ?? '').toString().toLowerCase())
                .some(v => v.includes(q));
        });
    }, [tasks, search, filter]);

    const openCount = tasks.filter(t => !CLOSED.includes((t.status || '').toLowerCase())).length;

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">Tasks</h1>
                    <p className="section-subtitle">{openCount} open · {tasks.length} total</p>
                </div>
            </header>

            <div className="surface-card page-card">
                <TaskForm addTask={addTask} />
            </div>

            <div className="toolbar">
                <InputGroup className="search-box">
                    <InputGroup.Text>Search</InputGroup.Text>
                    <Form.Control
                        placeholder="Filter by task, department, assignee, room…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
                <div className="filter-pills">
                    {['all', 'open', 'done'].map(f => (
                        <button
                            key={f}
                            className={`pill ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'all' ? 'All' : f === 'open' ? 'Open' : 'Completed'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="surface-card page-card">
                <TaskList tasks={visibleTasks} handleDelete={handleDelete} handleToggleStatus={handleToggleStatus} />
            </div>
        </div>
    );
}
