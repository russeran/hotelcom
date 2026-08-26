const request = require('supertest');
const app = require('../app');

async function signup(name, email, password = 'secret1') {
    const res = await request(app).post('/api/users').send({ name, email, password });
    return res;
}

describe('Users & auth', () => {
    test('first signup becomes admin; subsequent become staff', async () => {
        const first = await signup('Admin', 'admin@t.com');
        expect(first.status).toBe(200);
        expect(decodeToken(first.body).user.role).toBe('admin');

        const second = await signup('Worker', 'worker@t.com');
        expect(decodeToken(second.body).user.role).toBe('staff');
    });

    test('login succeeds with correct password and fails otherwise', async () => {
        await signup('U', 'u@t.com', 'secret1');
        const ok = await request(app).post('/api/users/login').send({ email: 'u@t.com', password: 'secret1' });
        expect(ok.status).toBe(200);
        const bad = await request(app).post('/api/users/login').send({ email: 'u@t.com', password: 'nope123' });
        expect(bad.status).toBe(400);
    });

    test('signup validation rejects missing fields and short passwords', async () => {
        const missing = await request(app).post('/api/users').send({ email: 'x@t.com' });
        expect(missing.status).toBe(400);
        const short = await request(app).post('/api/users').send({ name: 'X', email: 'x@t.com', password: 'ab' });
        expect(short.status).toBe(400);
    });

    test('RBAC: user list is admin-only; anonymous is 401', async () => {
        const admin = (await signup('Admin', 'admin@t.com')).body;
        const staff = (await signup('Staff', 'staff@t.com')).body;

        const asAdmin = await request(app).get('/api/users').set('Authorization', `Bearer ${admin}`);
        expect(asAdmin.status).toBe(200);
        expect(Array.isArray(asAdmin.body)).toBe(true);

        const asStaff = await request(app).get('/api/users').set('Authorization', `Bearer ${staff}`);
        expect(asStaff.status).toBe(403);

        const anon = await request(app).get('/api/users');
        expect(anon.status).toBe(401);
    });

    test('immediate role enforcement: promotion takes effect on next request (no re-login)', async () => {
        const admin = (await signup('Admin', 'admin@t.com')).body;
        const staff = (await signup('Staff', 'staff@t.com')).body;
        const staffId = decodeToken(staff).user._id;

        // Staff blocked initially.
        expect((await request(app).get('/api/users').set('Authorization', `Bearer ${staff}`)).status).toBe(403);

        // Admin promotes them to admin.
        await request(app).put(`/api/users/${staffId}/role`).set('Authorization', `Bearer ${admin}`).send({ role: 'admin' });

        // SAME staff token now works because role is resolved from the DB per request.
        expect((await request(app).get('/api/users').set('Authorization', `Bearer ${staff}`)).status).toBe(200);
    });

    test('admin cannot change their own role', async () => {
        const admin = (await signup('Admin', 'admin@t.com')).body;
        const adminId = decodeToken(admin).user._id;
        const res = await request(app).put(`/api/users/${adminId}/role`).set('Authorization', `Bearer ${admin}`).send({ role: 'staff' });
        expect(res.status).toBe(400);
    });
});
