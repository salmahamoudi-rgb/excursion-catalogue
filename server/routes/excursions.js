const express = require('express');
const Excursion = require('../models/Excursion');
const Review = require('../models/Review');
const protect = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const excursions = await Excursion.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(excursions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, destination, price, description } = req.body;

    if (!title || !destination || price === undefined || price === '') {
      return res.status(400).json({ message: 'Title, destination and price are required' });
    }

    const excursion = await Excursion.create({
      title,
      destination,
      price,
      description,
      createdBy: req.user.id,
    });

    await excursion.populate('createdBy', 'name');
    res.status(201).json(excursion);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const excursion = await Excursion.findById(req.params.id);

    if (!excursion) {
      return res.status(404).json({ message: 'Excursion not found' });
    }

    await Review.deleteMany({ excursion: excursion._id });
    await excursion.deleteOne();

    res.json({ message: 'Excursion deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;