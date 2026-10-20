const request = require('supertest');
const app = require('../src/app');
const { register, login, getMyBookings } = require('./helpers/api');
const { signup, makeEmail } = require('./helpers/users');
describe('POST /api/auth/register', () => {
  it('registers a student', async () => {
    const email = makeEmail('stu');
    const res = await register({
      name: 'Riya',
      email,
      password: 'hey12345',
      role: 'student',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(email);
    expect(res.body.user.password).toBeUndefined();
  });

  it('registers a professor', async () => {
    const res = await register({
      name: 'Dr Mehta',
      email: makeEmail('prof'),
      password: 'hey12345',
      role: 'professor',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.role).toBe('professor');
  });

  it('fails when required fields are missing', async () => {
    const res = await register({ email: makeEmail('x') });
    expect(res.statusCode).toBe(400);
  });

  it('rejects unknown roles', async () => {
    const res = await register({
      name: 'Nope',
      email: makeEmail('role'),
      password: 'hey12345',
      role: 'admin',
    });
    expect(res.statusCode).toBe(400);
  });

  it('blocks duplicate emails', async () => {
    const email = makeEmail('dup');
    await register({ name: 'One', email, password: 'hey12345', role: 'student' });
    const res = await register({ name: 'Two', email, password: 'hey12345', role: 'student' });
    expect(res.statusCode).toBe(400);
  });
});
describe('POST /api/auth/login', () => {
  it('returns a token', async () => {
    const { body } = await signup({ name: 'Login Test', role: 'student' });
    const res = await login({ email: body.email, password: body.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.token.split('.').length).toBe(3);
});
  it('wrong password = 401', async () => {
    const { body } = await signup();
    const res = await login({ email: body.email, password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
});
  it('unknown email = 401', async () => {
    const res = await login({ email: 'nope@test.com', password: 'whatever' });
    expect(res.statusCode).toBe(401);
});
  it('needs email and password', async () => {
    const res = await login({});
    expect(res.statusCode).toBe(400);
  });
});
describe('auth middleware', () => {
  it('no token = 401', async () => {
    const res = await request(app).get('/api/appointments/my');
    expect(res.statusCode).toBe(401);
});
  it('junk token should fail', async () => {
    const res = await getMyBookings('abc.def.ghi');
    expect(res.statusCode).toBe(403);
  });
});