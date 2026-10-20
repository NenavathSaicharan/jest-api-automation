const request = require('supertest');
const app = require('../src/app');
const {register,login,addSlot,listSlots,book,cancel,getMyBookings,
} = require('./helpers/api');
describe('e2e register -> login -> book -> cancel', () => {
  it('P1 / A1 / A2 full path', async () => {
    expect(
      (
        await register({name: 'Professor P1',email: 'p1@college.test',password: 'ProfPass1!',role: 'professor',
        })
      ).statusCode
    ).toBe(201);
    expect(
      (
        await register({name: 'Student A1',email: 'a1@college.test',password: 'StudPass1!',role: 'student',
        })
      ).statusCode
    ).toBe(201);
    expect(
      (
        await register({name: 'Student A2',email: 'a2@college.test',password: 'StudPass2!',role: 'student',
        })
      ).statusCode
    ).toBe(201);
    const p1 = await login({ email: 'p1@college.test', password: 'ProfPass1!' });
    const a1 = await login({ email: 'a1@college.test', password: 'StudPass1!' });
    const a2 = await login({ email: 'a2@college.test', password: 'StudPass2!' });
    expect(p1.statusCode).toBe(200);
    expect(a1.statusCode).toBe(200);
    expect(a2.statusCode).toBe(200);
    const tokenP1 = p1.body.token;
    const tokenA1 = a1.body.token;
    const tokenA2 = a2.body.token;
    const professorId = p1.body.user.id;
    let mine = await getMyBookings(tokenA1);
    expect(mine.body).toEqual([]);
    const t1 = await addSlot(tokenP1, '2026-09-10T10:00:00.000Z');
    const t2 = await addSlot(tokenP1, '2026-09-10T11:00:00.000Z');
    expect(t1.statusCode).toBe(201);
    expect(t2.statusCode).toBe(201);
    expect((await listSlots(tokenA1, professorId)).body.length).toBe(2);
    const bookingA1 = await book(tokenA1, {professorId,availabilityId: t1.body._id,
    });
    expect(bookingA1.statusCode).toBe(201);
    const bookingA2 = await book(tokenA2, {professorId,availabilityId: t2.body._id});
    expect(bookingA2.statusCode).toBe(201);
    mine = await getMyBookings(tokenA1);
    expect(mine.body.length).toBe(1);
    expect((await listSlots(tokenA1, professorId)).body.length).toBe(0);
    const cancelled = await cancel(tokenP1, bookingA1.body._id);
    expect(cancelled.statusCode).toBe(200);
    mine = await getMyBookings(tokenA1);
    expect(mine.body.length).toBe(0);
    const left = await listSlots(tokenA2, professorId);
    expect(left.body.length).toBe(1);
    expect(left.body[0]._id).toBe(t1.body._id);
    const a2Mine = await getMyBookings(tokenA2);
    expect(a2Mine.body.length).toBe(1);
  });
  it('booking without token = 401', async () => {
    await register({name: 'Prof Temp',email: 'temp_prof@college.test',
password: 'TempPass1!',role: 'professor',
    });
const p1 = await login({
      email: 'temp_prof@college.test',
      password: 'TempPass1!',
    });

const slot = await addSlot(p1.body.token, '2026-09-12T15:00:00.000Z');
const res = await request(app).post('/api/appointments').send({professorId: p1.body.user.id,availabilityId: slot.body._id});
    expect(res.statusCode).toBe(401);
  });
});
