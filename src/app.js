const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/availability', require('./routes/availability'));
app.use('/api/appointments', require('./routes/appointments'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
