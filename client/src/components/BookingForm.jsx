import { useState } from 'react';
import api from '../api';

function BookingForm({ excursionId, onBooked }) {
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await api.post('/bookings', {
        excursionId,
        date,
        people: Number(people),
      });

      onBooked(response.data);
      setMessage('Booking confirmed');
      setDate('');
      setPeople(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not book the excursion');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        required
      />
      <input
        type="number"
        min="1"
        value={people}
        onChange={(event) => setPeople(event.target.value)}
        required
      />
      <button type="submit">Book</button>
    </form>
  );
}

export default BookingForm;