const request = require('supertest');
const app = require('../../src/app');
const bearer = (token) => ({ Authorization: `Bearer ${token}` });
const register = (body) => request(app).post('/api/auth/register').send(body);
const login = (body) => request(app).post('/api/auth/login').send(body);
function addSlot(token, time) {
  return request(app).post('/api/availability').set(bearer(token)).send({ time });
}
function listSlots(token, professorId) {
  return request(app).get('/api/availability/' + professorId).set(bearer(token));
}
function book(token, body) {
  return request(app).post('/api/appointments').set(bearer(token)).send(body);
}
function cancel(token, id) {
  return request(app).delete(`/api/appointments/${id}`).set(bearer(token));
}
function getMyBookings(token) {
  return request(app).get('/api/appointments/my').set(bearer(token));
}
module.exports = {app,request,register,login,addSlot,listSlots,book,cancel,getMyBookings,
};
