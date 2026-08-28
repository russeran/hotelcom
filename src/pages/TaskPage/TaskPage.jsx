import { useEffect, useState, useMemo } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import TaskForm from '../../components/TaskForm/TaskForm';
import TaskList from '../../components/TaskList/TaskList';
import { PRIORITY_RANK } from '../../components/PriorityBadge/PriorityBadge';
import { getUser } from '../../utilities/users-service';
import * as tasksAPI from '../../utilities/tasks-api';
import './TaskPage.css';

const CLOSED = ['done', 'resolved', 'complete', 'completed', 'closed', 'cancelled'];
const rank = (p) => PRIORITY_RANK[(p || 'normal').toLowerCase()] ?? 2;
const currentUser = getUser();

export default function TaskPage() {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    // Managers default to viewing their own department.
    const [dept, setDept] = useState(
        currentUser && currentUser.role === 'manager' && currentUser.department ? currentUser.department : 'all'
    );

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
        setShowForm(false); // Close form after adding task
    }

    async function handleDelete(taskId) {
        await tasksAPI.deleteATask(taskId);
        setTasks(tasks.filter(task => task._id !== taskId));
    }

    async function handleUpdateStatus(task, status) {
        const updatedTask = await tasksAPI.updateATask(task._id, { status });
        setTasks(tasks.map(t => (t._id === task._id ? updatedTask : t)));
    }

    async function handleAcknowledge(task) {
        const updatedTask = await tasksAPI.acknowledgeATask(task._id);
        setTasks(tasks.map(t => (t._id === task._id ? updatedTask : t)));
    }

    const departments = useMemo(() => {
        const set = new Set(tasks.map(t => (t.department || '').trim()).filter(Boolean));
        return ['all', ...Array.from(set)];
    }, [tasks]);

    const visibleTasks = useMemo(() => {
        const q = search.trim().toLowerCase();
        return tasks
            .filter(t => {
                const closed = CLOSED.includes((t.status || '').toLowerCase());
                if (filter === 'open' && closed) return false;
                if (filter === 'done' && !closed) return false;
                if (dept !== 'all' && (t.department || '').toLowerCase() !== dept.toLowerCase()) return false;
                if (!q) return true;
                return [t.task, t.department, t.user, t.room, t.status, t.priority]
                    .map(v => (v ?? '').toString().toLowerCase())
                    .some(v => v.includes(q));
            })
            // Sort by priority (Urgent first), keeping open tasks ahead of completed.
            .sort((a, b) => {
                const aClosed = CLOSED.includes((a.status || '').toLowerCase());
                const bClosed = CLOSED.includes((b.status || '').toLowerCase());
                if (aClosed !== bClosed) return aClosed ? 1 : -1;
                return rank(a.priority) - rank(b.priority);
            });
    }, [tasks, search, filter, dept]);

    const openCount = tasks.filter(t => !CLOSED.includes((t.status || '').toLowerCase())).length;
    const urgentCount = tasks.filter(t => (t.priority || '').toLowerCase() === 'urgent' && !CLOSED.includes((t.status || '').toLowerCase())).length;

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">Task Dispatch</h1>
                    <p className="section-subtitle">
                        {openCount} open · {tasks.length} total
                        {urgentCount > 0 && <span className="urgent-note"> · {urgentCount} urgent</span>}
                    </p>
                </div>
                <button 
                    className="task-add-btn"
                    onClick={() => setShowForm(!showForm)}
                    aria-label="Add new task"
                >
                    {showForm ? '✕ Cancel' : '+ New Task'}
                </button>
            </header>

            {showForm && (
                <div className="surface-card page-card">
                    <TaskForm addTask={addTask} />
                </div>
            )}

            <div className="toolbar">
                <InputGroup className="search-box">
                    <InputGroup.Text>Search</InputGroup.Text>
                    <Form.Control
                        placeholder="Filter by task, department, assignee, room…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
                <div className="toolbar-right">
                    <Form.Select
                        className="dept-select"
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        aria-label="Filter by department"
                    >
                        {departments.map(d => (
                            <option key={d} value={d}>{d === 'all' ? 'All departments' : d}</option>
                        ))}
                    </Form.Select>
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
            </div>

            <div className="surface-card page-card">
                <TaskList tasks={visibleTasks} handleDelete={handleDelete} handleUpdateStatus={handleUpdateStatus} handleAcknowledge={handleAcknowledge} currentUser={currentUser} />
            </div>
        </div>
    );
}
