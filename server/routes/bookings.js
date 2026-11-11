const express = require('express');
const Booking = require('../models/Booking');
const Excursion = require('../models/Excursion');
const protect = require('../middleware/protect');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user.id };

    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('excursion', 'title destination price date')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { excursionId, people } = req.body;

    if (!excursionId || !people) {
      return res.status(400).json({ message: 'Excursion and number of people are required' });
    }

    const excursion = await Excursion.findById(excursionId);
    if (!excursion) {
      return res.status(404).json({ message: 'Excursion not found' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      excursion: excursion._id,
      people,
    });

    await booking.populate('user', 'name email');
    await booking.populate('excursion', 'title destination price date');

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only cancel your own bookings' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;