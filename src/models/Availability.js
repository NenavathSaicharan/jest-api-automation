const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: Date, required: true },
  isBooked: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Availability', AvailabilitySchema);
