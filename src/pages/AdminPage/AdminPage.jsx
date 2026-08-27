import { useEffect, useState } from 'react';
import { Table, Form, Button, Badge } from 'react-bootstrap';
import * as usersAPI from '../../utilities/users-api';
import { getUser } from '../../utilities/users-service';
import AiConversationsPanel from '../../components/AiConversationsPanel/AiConversationsPanel';
import './AdminPage.css';

const ROLES = ['staff', 'manager', 'admin'];
const DEPARTMENTS = ['', 'Front Desk', 'Housekeeping', 'Maintenance', 'Food & Beverage', 'Security', 'Concierge'];

const ACTION_VARIANT = { create: 'success', update: 'info', delete: 'danger', role_change: 'warning' };

function formatWhen(value) {
    const d = new Date(value);
    return isNaN(d) ? '' : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminPage() {
    const PAGE = 25;
    const me = getUser();
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [logTotal, setLogTotal] = useState(0);
    const [error, setError] = useState('');

    async function load() {
        try {
            const [u, l] = await Promise.all([
                usersAPI.getUsers(),
                usersAPI.getAuditLog({ limit: PAGE, skip: 0 }).catch(() => ({ logs: [], total: 0 })),
            ]);
            setUsers(u);
            setLogs(l.logs || []);
            setLogTotal(l.total || 0);
        } catch {
            setError('Could not load users.');
        }
    }

    async function loadMoreLogs() {
        const more = await usersAPI.getAuditLog({ limit: PAGE, skip: logs.length }).catch(() => ({ logs: [] }));
        setLogs(prev => [...prev, ...(more.logs || [])]);
    }

    useEffect(() => { load(); }, []);

    async function changeField(userId, field, value) {
        const updated = await usersAPI.updateUserRole(userId, { [field]: value });
        setUsers(users.map(u => (u._id === userId ? updated : u)));
    }

    async function handleDelete(userId) {
        try {
            await usersAPI.deleteUser(userId);
            setUsers(users.filter(u => u._id !== userId));
        } catch {
            setError('Could not delete user.');
        }
    }

    if (!me || me.role !== 'admin') {
        return (
            <div className="page">
                <div className="surface-card page-card empty-state">
                    Access denied — this area is for administrators only.
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">User Management</h1>
                    <p className="section-subtitle">{users.length} user{users.length === 1 ? '' : 's'} · assign roles &amp; departments</p>
                </div>
            </header>

            {error && <div className="surface-card page-card empty-state">{error}</div>}

            <div className="surface-card page-card">
                <Table hover responsive className="align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => {
                            const isSelf = u._id === me._id;
                            return (
                                <tr key={u._id}>
                                    <td>
                                        {u.name}
                                        {isSelf && <Badge bg="secondary" className="ms-2">you</Badge>}
                                    </td>
                                    <td className="muted">{u.email}</td>
                                    <td>
                                        <Form.Select
                                            size="sm"
                                            className="admin-select"
                                            value={u.role || 'staff'}
                                            onChange={(e) => changeField(u._id, 'role', e.target.value)}
                                        >
                                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <Form.Select
                                            size="sm"
                                            className="admin-select"
                                            value={u.department || ''}
                                            onChange={(e) => changeField(u._id, 'department', e.target.value)}
                                        >
                                            {DEPARTMENTS.map(d => <option key={d || 'none'} value={d}>{d || '—'}</option>)}
                                        </Form.Select>
                                    </td>
                                    <td className="text-end">
                                        {!isSelf && (
                                            <Button size="sm" variant="outline-danger" onClick={() => handleDelete(u._id)}>Delete</Button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
            <p className="muted admin-hint">Role and department changes propagate to signed-in users automatically within ~30 seconds.</p>

            {/* AI Concierge Analytics */}
            <AiConversationsPanel />

            <header className="page-header mt-4">
                <div>
                    <h2 className="section-title">Activity Log</h2>
                    <p className="section-subtitle">Showing {logs.length} of {logTotal} action{logTotal === 1 ? '' : 's'}</p>
                </div>
            </header>
            <div className="surface-card page-card">
                {logs.length === 0 ? (
                    <div className="empty-state">No activity recorded yet.</div>
                ) : (
                    <Table hover responsive className="align-middle mb-0">
                        <thead>
                            <tr>
                                <th>When</th>
                                <th>Actor</th>
                                <th>Action</th>
                                <th>Entity</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log._id}>
                                    <td className="text-nowrap muted">{formatWhen(log.createdAt)}</td>
                                    <td>{log.actor} <span className="muted">({log.role || 'staff'})</span></td>
                                    <td><Badge bg={ACTION_VARIANT[log.action] || 'secondary'} className="text-uppercase">{log.action.replace('_', ' ')}</Badge></td>
                                    <td className="text-capitalize">{log.entity}</td>
                                    <td className="muted audit-details">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                {logs.length < logTotal && (
                    <div className="text-center mt-3">
                        <Button size="sm" variant="outline-secondary" onClick={loadMoreLogs}>Load more</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
