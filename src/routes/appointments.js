const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  bookAppointment,
  cancelAppointment,
  getMyAppointments,
} = require('../controllers/appointmentController');

// put /my before /:id
router.get('/my', auth, getMyAppointments);
router.post('/', auth, bookAppointment);
router.delete('/:id', auth, cancelAppointment);

module.exports = router;
