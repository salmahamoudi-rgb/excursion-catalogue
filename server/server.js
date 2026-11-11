require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Excursion Catalogue API is running' });
});

const PORT = process.env.PORT || 5000;

app.use('/api/auth', require('./routes/auth'));
app.use('/api/excursions', require('./routes/excursions'));
app.use('/api/reviews', require('./routes/reviews'));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });