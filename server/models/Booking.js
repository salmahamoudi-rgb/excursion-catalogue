const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    excursion: { type: mongoose.Schema.Types.ObjectId, ref: 'Excursion', required: true },
    people: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);