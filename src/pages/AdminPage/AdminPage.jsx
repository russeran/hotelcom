import { useEffect, useState } from 'react';
import { Table, Form, Button, Badge } from 'react-bootstrap';
import * as usersAPI from '../../utilities/users-api';
import { getUser } from '../../utilities/users-service';
import './AdminPage.css';

const ROLES = ['staff', 'manager', 'admin'];
const DEPARTMENTS = ['', 'Front Desk', 'Housekeeping', 'Maintenance', 'Food & Beverage', 'Security', 'Concierge'];

export default function AdminPage() {
    const me = getUser();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    async function load() {
        try {
            setUsers(await usersAPI.getUsers());
        } catch {
            setError('Could not load users.');
        }
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
            <p className="muted admin-hint">Role and department changes take effect the next time the user logs in.</p>
        </div>
    );
}
