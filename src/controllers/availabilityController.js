const Availability = require('../models/Availability');

exports.createAvailability = async (req, res) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ message: 'Only professors can set availability' });
  }

  if (!req.body || !req.body.time) {
    return res.status(400).json({ message: 'time is required' });
  }

  const time = new Date(req.body.time);
  if (isNaN(time.getTime())) {
    return res.status(400).json({ message: 'time must be a valid date' });
  }

  try {
    const slot = await Availability.create({
      professorId: req.user.id,
      time,
    });
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const slots = await Availability.find({
      professorId: req.params.professorId,
      isBooked: false,
    }).sort({ time: 1 });
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
