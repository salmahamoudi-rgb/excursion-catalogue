const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    excursion: { type: mongoose.Schema.Types.ObjectId, ref: 'Excursion', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);