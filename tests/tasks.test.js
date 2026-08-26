const request = require('supertest');
const app = require('../app');

function auth(token) {
    return { Authorization: `Bearer ${token}` };
}

async function signup(name, email) {
    return (await request(app).post('/api/users').send({ name, email, password: 'secret1' })).body;
}

async function makeAdminAndManager(dept) {
    const admin = await signup('Admin', 'admin@t.com'); // first => admin
    const mgrTok = await signup('Mgr', 'mgr@t.com');     // staff
    const mgrId = decodeToken(mgrTok).user._id;
    await request(app).put(`/api/users/${mgrId}/role`).set(auth(admin)).send({ role: 'manager', department: dept });
    return { admin, mgrTok };
}

async function createTask(token, overrides = {}) {
    const body = { status: 'Open', priority: 'Normal', department: 'Maintenance', room: '1', user: 'x', task: 'fix', ...overrides };
    return request(app).post('/api/tasks/create').set(auth(token)).send(body);
}

describe('Tasks', () => {
    test('create requires auth (401) and validates required fields (400)', async () => {
        const anon = await request(app).post('/api/tasks/create').send({ task: 'x', department: 'Maintenance' });
        expect(anon.status).toBe(401);

        const admin = await signup('Admin', 'admin@t.com');
        const invalid = await request(app).post('/api/tasks/create').set(auth(admin)).send({ task: '' });
        expect(invalid.status).toBe(400);
    });

    test('acknowledge sets status + acknowledgedBy', async () => {
        const admin = await signup('Admin', 'admin@t.com');
        const created = await createTask(admin, { task: 'ack me' });
        const ack = await request(app).put(`/api/tasks/${created.body._id}/acknowledge`).set(auth(admin));
        expect(ack.status).toBe(200);
        expect(ack.body.status).toBe('Acknowledged');
        expect(ack.body.acknowledgedBy).toBe('Admin');
        expect(ack.body.acknowledgedAt).toBeTruthy();
    });

    test('delete is role/department gated', async () => {
        const { admin, mgrTok } = await makeAdminAndManager('Maintenance');
        const staff = await signup('Staff', 'staff@t.com');

        const mt = await createTask(admin, { department: 'Maintenance', task: 'mt' });
        const hk = await createTask(admin, { department: 'Housekeeping', task: 'hk' });

        // Staff cannot delete.
        expect((await request(app).delete(`/api/tasks/delete/${mt.body._id}`).set(auth(staff))).status).toBe(403);
        // Manager can delete within their department, not others'.
        expect((await request(app).delete(`/api/tasks/delete/${mt.body._id}`).set(auth(mgrTok))).status).toBe(200);
        expect((await request(app).delete(`/api/tasks/delete/${hk.body._id}`).set(auth(mgrTok))).status).toBe(403);
        // Admin can delete any.
        expect((await request(app).delete(`/api/tasks/delete/${hk.body._id}`).set(auth(admin))).status).toBe(200);
    });

    test('creating a task emits a scoped notification', async () => {
        const admin = await signup('Admin', 'admin@t.com');
        await createTask(admin, { department: 'Maintenance', priority: 'Urgent', task: 'burst pipe' });
        const notifs = await request(app).get('/api/notifications/index').set(auth(admin));
        expect(notifs.status).toBe(200);
        expect(notifs.body.some(n => /burst pipe/.test(n.message) && n.department === 'Maintenance')).toBe(true);
    });

    test('bad id returns 400 (not a hang)', async () => {
        const admin = await signup('Admin', 'admin@t.com');
        const res = await request(app).put('/api/tasks/not-a-real-id').set(auth(admin)).send({ status: 'Done' });
        expect(res.status).toBe(400);
    });
});
