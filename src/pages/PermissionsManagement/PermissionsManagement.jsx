import { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Table, Badge, Accordion } from 'react-bootstrap';
import * as permissionsAPI from '../../utilities/permissions-api';
import './PermissionsManagement.css';

const ROLES = ['staff', 'manager', 'admin'];
const DEPARTMENTS = ['Front Desk', 'Food & Beverage', 'Housekeeping', 'Concierge', 'Maintenance', 'All'];

export default function PermissionsManagement() {
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState('staff');
    const [selectedDept, setSelectedDept] = useState('Front Desk');
    const [currentPermission, setCurrentPermission] = useState(null);
    const [isDefault, setIsDefault] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadAllPermissions();
    }, []);

    useEffect(() => {
        loadPermission();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRole, selectedDept]);

    async function loadAllPermissions() {
        const data = await permissionsAPI.getAllPermissions();
        setPermissions(data);
    }

    async function loadPermission() {
        setLoading(true);
        try {
            const data = await permissionsAPI.getPermission(selectedRole, selectedDept);
            setCurrentPermission(data);
            setIsDefault(data.isDefault || false);
        } catch (err) {
            console.error('Failed to load permission:', err);
        }
        setLoading(false);
    }

    async function handleSave() {
        try {
            if (isDefault || !currentPermission._id) {
                // Create new
                await permissionsAPI.createPermission({
                    role: selectedRole,
                    department: selectedDept,
                    permissions: currentPermission.permissions
                });
            } else {
                // Update existing
                await permissionsAPI.updatePermission(currentPermission._id, {
                    permissions: currentPermission.permissions
                });
            }
            await loadAllPermissions();
            await loadPermission();
            alert('Permissions saved successfully!');
        } catch (err) {
            console.error('Failed to save permissions:', err);
            alert('Failed to save permissions: ' + (err.message || 'Unknown error'));
        }
    }

    async function handleInitializeDefaults() {
        if (!window.confirm('Initialize default permissions for all roles/departments? This will not override existing custom permissions.')) return;
        try {
            await permissionsAPI.initializeDefaults();
            await loadAllPermissions();
            alert('Default permissions initialized!');
        } catch (err) {
            console.error('Failed to initialize defaults:', err);
        }
    }

    function handleToggle(category, key) {
        if (!currentPermission) return;
        setCurrentPermission({
            ...currentPermission,
            permissions: {
                ...currentPermission.permissions,
                [category]: {
                    ...currentPermission.permissions[category],
                    [key]: !currentPermission.permissions[category][key]
                }
            }
        });
    }

    if (!currentPermission) return <div className="page"><div className="loading">Loading...</div></div>;

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">🔐 Permissions Management</h1>
                    <p className="section-subtitle">Configure role and department-based access control</p>
                </div>
                <Button variant="outline-primary" onClick={handleInitializeDefaults}>
                    Initialize Defaults
                </Button>
            </header>

            <div className="surface-card page-card">
                <Row className="g-3 mb-4">
                    <Col md={6}>
                        <Form.Label>Role</Form.Label>
                        <Form.Select 
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            {ROLES.map(role => (
                                <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={6}>
                        <Form.Label>Department</Form.Label>
                        <Form.Select 
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>

                {isDefault && (
                    <div className="default-badge-box">
                        <Badge bg="info">Using Default Permissions</Badge>
                        <span className="text-muted ms-2">Save to create custom permissions for this role/department</span>
                    </div>
                )}

                {loading ? (
                    <div className="loading-state">Loading permissions...</div>
                ) : (
                    <Accordion defaultActiveKey="0" className="permissions-accordion">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>📄 Page Access ({Object.values(currentPermission.permissions.pages).filter(Boolean).length} enabled)</Accordion.Header>
                            <Accordion.Body>
                                <div className="permissions-grid">
                                    {Object.keys(currentPermission.permissions.pages).map(key => (
                                        <div key={key} className="permission-item">
                                            <Form.Check
                                                type="switch"
                                                id={`page-${key}`}
                                                label={formatLabel(key)}
                                                checked={currentPermission.permissions.pages[key]}
                                                onChange={() => handleToggle('pages', key)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header>📊 Dashboard Cards ({Object.values(currentPermission.permissions.dashboardCards).filter(Boolean).length} enabled)</Accordion.Header>
                            <Accordion.Body>
                                <div className="permissions-grid">
                                    {Object.keys(currentPermission.permissions.dashboardCards).map(key => (
                                        <div key={key} className="permission-item">
                                            <Form.Check
                                                type="switch"
                                                id={`card-${key}`}
                                                label={formatLabel(key)}
                                                checked={currentPermission.permissions.dashboardCards[key]}
                                                onChange={() => handleToggle('dashboardCards', key)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                            <Accordion.Header>⚡ Actions ({Object.values(currentPermission.permissions.actions).filter(Boolean).length} enabled)</Accordion.Header>
                            <Accordion.Body>
                                <div className="permissions-grid">
                                    {Object.keys(currentPermission.permissions.actions).map(key => (
                                        <div key={key} className="permission-item">
                                            <Form.Check
                                                type="switch"
                                                id={`action-${key}`}
                                                label={formatLabel(key)}
                                                checked={currentPermission.permissions.actions[key]}
                                                onChange={() => handleToggle('actions', key)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                )}

                <div className="form-actions mt-4">
                    <Button variant="primary" onClick={handleSave} disabled={loading}>
                        {isDefault ? 'Create Custom Permissions' : 'Save Changes'}
                    </Button>
                    <Button variant="outline-secondary" onClick={loadPermission} disabled={loading}>
                        Reset
                    </Button>
                </div>
            </div>

            <div className="surface-card page-card mt-4">
                <h3 className="mb-3">All Configured Permissions</h3>
                <Table hover responsive className="permissions-management-table">
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Pages</th>
                            <th>Cards</th>
                            <th>Actions</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map(perm => (
                            <tr key={perm._id}>
                                <td><Badge bg="primary">{perm.role}</Badge></td>
                                <td>{perm.department}</td>
                                <td>{Object.values(perm.permissions.pages).filter(Boolean).length}</td>
                                <td>{Object.values(perm.permissions.dashboardCards).filter(Boolean).length}</td>
                                <td>{Object.values(perm.permissions.actions).filter(Boolean).length}</td>
                                <td>
                                    <Badge bg={perm.isActive ? 'success' : 'secondary'}>
                                        {perm.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {permissions.length === 0 && (
                    <div className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                        No custom permissions configured. Click "Initialize Defaults" to create default permission sets.
                    </div>
                )}
            </div>
        </div>
    );
}

function formatLabel(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}
