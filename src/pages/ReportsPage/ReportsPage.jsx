import { useEffect, useState, useMemo } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import * as tasksAPI from '../../utilities/tasks-api';
import * as complaintsAPI from '../../utilities/complaints-api';
import * as roomsAPI from '../../utilities/rooms-api';
import * as reservationsAPI from '../../utilities/reservations-api';
import { canManage } from '../../utilities/users-service';
import { downloadCSV } from '../../utilities/csv';
import './ReportsPage.css';

const CLOSED = ['done', 'resolved', 'complete', 'completed', 'closed', 'cancelled'];
const isOpen = (s) => !CLOSED.includes((s || '').toLowerCase());

function BarList({ data, accent = 'primary' }) {
    const max = Math.max(1, ...data.map(d => d.value));
    return (
        <div className="bar-list">
            {data.length === 0 && <div className="muted">No data.</div>}
            {data.map(d => (
                <div className="bar-row" key={d.label}>
                    <div className="bar-label">{d.label}</div>
                    <div className="bar-track">
                        <div className={`bar-fill accent-${accent}`} style={{ width: `${(d.value / max) * 100}%` }} />
                    </div>
                    <div className="bar-value">{d.value}</div>
                </div>
            ))}
        </div>
    );
}

function groupCount(items, keyFn) {
    const map = {};
    items.forEach(i => { const k = keyFn(i) || '—'; map[k] = (map[k] || 0) + 1; });
    return Object.entries(map).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

export default function ReportsPage() {
    const [data, setData] = useState({ tasks: [], complaints: [], rooms: [], reservations: [] });
    const allowed = canManage();

    useEffect(() => {
        if (!allowed) return;
        Promise.all([
            tasksAPI.getAllTasks().catch(() => []),
            complaintsAPI.getAllComplaints().catch(() => []),
            roomsAPI.getAllRooms().catch(() => []),
            reservationsAPI.getAllReservations().catch(() => []),
        ]).then(([tasks, complaints, rooms, reservations]) => setData({ tasks, complaints, rooms, reservations }));
    }, [allowed]);

    const metrics = useMemo(() => {
        const { tasks, complaints, rooms } = data;
        const openTasks = tasks.filter(t => isOpen(t.status)).length;
        const acked = tasks.filter(t => t.acknowledgedAt && t.createdAt);
        const avgAckMin = acked.length
            ? Math.round(acked.reduce((sum, t) => sum + (new Date(t.acknowledgedAt) - new Date(t.createdAt)), 0) / acked.length / 60000)
            : null;
        const occupied = rooms.filter(r => r.status === 'Occupied').length;
        const occupancy = rooms.length ? Math.round((occupied / rooms.length) * 100) : 0;
        return {
            openTasks,
            totalTasks: tasks.length,
            avgAckMin,
            byDept: groupCount(tasks, t => t.department),
            byPriority: groupCount(tasks, t => t.priority || 'Normal'),
            openComplaints: complaints.filter(c => isOpen(c.status)).length,
            resolvedComplaints: complaints.filter(c => !isOpen(c.status)).length,
            complaintsByDept: groupCount(complaints, c => c.department),
            occupancy,
        };
    }, [data]);

    if (!allowed) {
        return <div className="page"><div className="surface-card page-card empty-state">Reports are available to managers and admins.</div></div>;
    }

    function exportTasks() {
        downloadCSV('tasks.csv', [
            { label: 'Task', value: 'task' },
            { label: 'Department', value: 'department' },
            { label: 'Priority', value: 'priority' },
            { label: 'Status', value: 'status' },
            { label: 'Room', value: 'room' },
            { label: 'Assignee', value: 'user' },
            { label: 'Created', value: t => t.createdAt },
            { label: 'Acknowledged', value: t => t.acknowledgedAt || '' },
        ], data.tasks);
    }

    function exportComplaints() {
        downloadCSV('complaints.csv', [
            { label: 'Room', value: 'room' },
            { label: 'Guest', value: 'name' },
            { label: 'Issue', value: 'issue' },
            { label: 'Solution', value: 'solution' },
            { label: 'Status', value: 'status' },
            { label: 'Department', value: 'department' },
            { label: 'Created', value: c => c.createdAt },
        ], data.complaints);
    }

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">Reports & Analytics</h1>
                    <p className="section-subtitle">Operational snapshot across the property</p>
                </div>
                <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-secondary" onClick={exportTasks}>Export tasks CSV</Button>
                    <Button size="sm" variant="outline-secondary" onClick={exportComplaints}>Export complaints CSV</Button>
                </div>
            </header>

            <Row className="g-3 mb-1">
                <Col xs={6} md={3}><div className="report-kpi surface-card"><div className="kpi-value">{metrics.openTasks}</div><div className="kpi-label">Open tasks</div></div></Col>
                <Col xs={6} md={3}><div className="report-kpi surface-card"><div className="kpi-value">{metrics.avgAckMin != null ? `${metrics.avgAckMin}m` : '—'}</div><div className="kpi-label">Avg. time to acknowledge</div></div></Col>
                <Col xs={6} md={3}><div className="report-kpi surface-card"><div className="kpi-value">{metrics.openComplaints}</div><div className="kpi-label">Open complaints</div></div></Col>
                <Col xs={6} md={3}><div className="report-kpi surface-card"><div className="kpi-value">{metrics.occupancy}%</div><div className="kpi-label">Occupancy</div></div></Col>
            </Row>

            <Row className="g-3">
                <Col md={4}>
                    <div className="surface-card page-card"><h2 className="panel-title">Tasks by department</h2><BarList data={metrics.byDept} accent="primary" /></div>
                </Col>
                <Col md={4}>
                    <div className="surface-card page-card"><h2 className="panel-title">Tasks by priority</h2><BarList data={metrics.byPriority} accent="warning" /></div>
                </Col>
                <Col md={4}>
                    <div className="surface-card page-card"><h2 className="panel-title">Complaints by department</h2><BarList data={metrics.complaintsByDept} accent="danger" /></div>
                </Col>
            </Row>
        </div>
    );
}
