const { addSlot, listSlots, book, cancel, getMyBookings } = require('./helpers/api');
const { signupAndLogin } = require('./helpers/users');
describe('booking apis', () => {let prof;let student;let otherProf;
  beforeEach(async () => {prof = await signupAndLogin({ name: 'Prof P1', role: 'professor' });
    student = await signupAndLogin({ name: 'Student A1', role: 'student' });
    otherProf = await signupAndLogin({ name: 'Other Prof', role: 'professor' });
  });
  it('prof can open a slot', async () => {
    const res = await addSlot(prof.token, '2026-08-01T10:00:00.000Z');
    expect(res.statusCode).toBe(201);
    expect(res.body.isBooked).toBe(false);
});
  it('student cannot create availability', async () => {
    const res = await addSlot(student.token, '2026-08-01T10:00:00.000Z');
    expect(res.statusCode).toBe(403);
});
  it('time is required', async () => {
    const res = await addSlot(prof.token);
    expect(res.statusCode).toBe(400);}
);
  it('only open slots are listed', async () => {
    const open = await addSlot(prof.token, '2026-08-02T09:00:00.000Z');
    const taken = await addSlot(prof.token, '2026-08-02T10:00:00.000Z');
      await book(student.token,{professorId: prof.user.id, availabilityId: taken.body._id}
  );
    const res = await listSlots(student.token, prof.user.id);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id).toBe(open.body._id);
});
  it('student can book', async () => {
    const slot = await addSlot(prof.token, '2026-08-03T11:00:00.000Z');
    const res = await book(student.token,{professorId: prof.user.id,
      availabilityId: slot.body._id
        
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('booked');
});
  it('professor cannot book', async () => {
    const slot = await addSlot(prof.token, '2026-08-03T12:00:00.000Z');
    const res = await book(prof.token, {
      professorId: prof.user.id,
      availabilityId: slot.body._id,
    });
    expect(res.statusCode).toBe(403);
});
  it('same slot cant be booked twice', async () => {
    const slot = await addSlot(prof.token, '2026-08-03T13:00:00.000Z');
    const s2 = await signupAndLogin({ name: 'Student A2', role: 'student' });
    const first = await book(student.token, {professorId: prof.user.id,availabilityId: slot.body._id,
});
    expect(first.statusCode).toBe(201);
    const second = await book(s2.token, {professorId: prof.user.id,availabilityId: slot.body._id,
});
    expect(second.statusCode).toBe(400);
});
  it('rejects mismatched professorId', async () => {
    const slot = await addSlot(prof.token, '2026-08-03T14:00:00.000Z');
    const res = await book(student.token, {professorId: otherProf.user.id,availabilityId: slot.body._id,
});
    expect(res.statusCode).toBe(400);
  });
    it('prof can cancel and slot opens again', async () => {
    const slot = await addSlot(prof.token, '2026-08-04T09:00:00.000Z');
    const booked = await book(student.token, {professorId: prof.user.id,availabilityId: slot.body._id,
});
    const res = await cancel(prof.token, booked.body._id);
    expect(res.statusCode).toBe(200);
    const open = await listSlots(student.token, prof.user.id);
    expect(open.body.map((s) => s._id)).toContain(slot.body._id);
    const mine = await getMyBookings(student.token);
    expect(mine.body.length).toBe(0);
  });
  it('student cannot cancel', async () => {
    const slot = await addSlot(prof.token, '2026-08-04T10:00:00.000Z');
    const booked = await book(student.token,{professorId: prof.user.id,availabilityId: slot.body._id,
  });
    const res = await cancel(student.token, booked.body._id);
    expect(res.statusCode).toBe(403);
  });
  it('other professor cannot cancel', async () => {
    const slot = await addSlot(prof.token, '2026-08-04T11:00:00.000Z');
    const booked = await book(student.token, {professorId: prof.user.id,availabilityId: slot.body._id,
  });
    const res = await cancel(otherProf.token, booked.body._id);
    expect(res.statusCode).toBe(403);
  });
  it('cancel missing appointment = 404', async () => {
    const res = await cancel(prof.token, '507f1f77bcf86cd799439011');
    expect(res.statusCode).toBe(404);
  });
});
