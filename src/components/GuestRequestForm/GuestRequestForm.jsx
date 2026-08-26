import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import * as tasksAPI from '../../utilities/tasks-api';
import { notifySuccess } from '../../utilities/toast';

const BLANK = { room: '', department: 'Housekeeping', priority: 'Normal', task: '' };
const DEPARTMENTS = ['Housekeeping', 'Maintenance', 'Front Desk', 'Food & Beverage', 'Security', 'Concierge'];

// Front desk logs a guest request; it becomes a routed, department-tagged task
// (which also notifies that department).
export default function GuestRequestForm() {
    const [form, setForm] = useState(BLANK);
    const [saving, setSaving] = useState(false);

    function change(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await tasksAPI.addATask({
                status: 'Open',
                priority: form.priority,
                department: form.department,
                room: form.room,
                user: '',
                task: form.task
            });
            notifySuccess(`Request routed to ${form.department}`);
            setForm(BLANK);
        } finally {
            setSaving(false);
        }
    }

    return (
        <Form onSubmit={handleSubmit} className="guest-request-form">
            <Form.Control
                name="task"
                as="textarea"
                rows={2}
                placeholder="What does the guest need? (e.g. extra towels to room 214)"
                value={form.task}
                onChange={change}
                required
                className="mb-2"
            />
            <div className="d-flex gap-2 mb-2">
                <Form.Control name="room" placeholder="Room" value={form.room} onChange={change} style={{ maxWidth: 90 }} />
                <Form.Select name="department" value={form.department} onChange={change}>
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </Form.Select>
                <Form.Select name="priority" value={form.priority} onChange={change} style={{ maxWidth: 120 }}>
                    <option>Low</option><option>Normal</option><option>High</option><option>Urgent</option>
                </Form.Select>
            </div>
            <Button type="submit" variant="primary" disabled={saving || !form.task.trim()}>
                {saving ? 'Sending…' : 'Send to department'}
            </Button>
        </Form>
    );
}
