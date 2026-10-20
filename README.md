# College appointment API tests

This repo has a small Express API plus Jest/Supertest tests for the auth and booking flow.

Basically: register -> login -> book a slot -> cancel it.

## What I tested

Auth:
- POST /api/auth/register
- POST /api/auth/login

Booking:
- POST /api/availability (professor only)
- POST /api/appointments (student only)
- DELETE /api/appointments/:id (professor only)

I also call these in a few places:
- GET /api/availability/:professorId
- GET /api/appointments/my

## Before you run anything

Need Node 18 or higher, and npm.

You don't need Mongo installed just to run tests. The tests spin up mongodb-memory-server on their own.
Mongo is only needed if you want to start the actual server.

## Getting it running

```bash
npm install
cp .env.example .env
```

Then fill in `.env` if you're starting the server. Mine looks like this:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/college_appointments
JWT_SECRET=change_me_to_something_long_and_random
NODE_ENV=development
```

A couple things to know:
- `npm test` ignores MONGO_URI
- if JWT_SECRET isn't set during tests, setup.js just uses a dummy one
- roles are only `student` and `professor`

## Tests

```bash
npm test
```

or watch mode:

```bash
npm run test:watch
```

Test files are under `tests/`:
- auth.test.js
- booking.test.js
- e2e.workflow.test.js

Request helpers are in `tests/helpers/`.
Shared setup (memory mongo, cleanup) is in `tests/setup.js`.
Jest options are in `jest.config.js`.

Note: first `npm test` can take a bit because mongodb-memory-server downloads a binary.

## Starting the API

Optional, only if you want to hit it manually:

```bash
npm start
```

Then check `GET http://localhost:5000/health`.

For anything that needs auth, send:

```
Authorization: Bearer <token>
```
