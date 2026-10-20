const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');

exports.bookAppointment = async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can book appointments' });
  }

  const professorId = req.body && req.body.professorId;
  const availabilityId = req.body && req.body.availabilityId;

  if (!professorId || !availabilityId) {
    return res.status(400).json({ message: 'professorId and availabilityId are required' });
  }

  try {
    const slot = await Availability.findById(availabilityId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    if (String(slot.professorId) !== String(professorId)) {
      return res.status(400).json({ message: 'Slot does not belong to this professor' });
    }

    slot.isBooked = true;
    await slot.save();

    const appointment = await Appointment.create({
      studentId: req.user.id,
      professorId,
      availabilityId,
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ message: 'Only professors can cancel appointments' });
  }

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (String(appointment.professorId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment already cancelled' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // free the slot again
    const slot = await Availability.findById(appointment.availabilityId);
    if (slot) {
      slot.isBooked = false;
      await slot.save();
    }

    res.status(200).json({ message: 'Appointment cancelled', appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can view their appointments' });
  }

  try {
    const list = await Appointment.find({ studentId: req.user.id, status: 'booked' });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
