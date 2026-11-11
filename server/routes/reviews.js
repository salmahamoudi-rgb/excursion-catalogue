const express = require('express');
const Review = require('../models/Review');
const Excursion = require('../models/Excursion');
const protect = require('../middleware/protect');

const router = express.Router();

router.get('/:excursionId', async (req, res) => {
  try {
    const reviews = await Review.find({ excursion: req.params.excursionId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:excursionId', protect, async (req, res) => {
  try {
    const { text, rating } = req.body;

    if (!text || !rating) {
      return res.status(400).json({ message: 'Text and rating are required' });
    }

    const excursion = await Excursion.findById(req.params.excursionId);
    if (!excursion) {
      return res.status(404).json({ message: 'Excursion not found' });
    }

    const review = await Review.create({
      text,
      rating,
      excursion: excursion._id,
      author: req.user.id,
    });

    await review.populate('author', 'name');
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;