import { useState } from 'react';
import api from '../api';

function BookingForm({ excursionId, onBooked }) {
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
        people: Number(people),
      });

      onBooked(response.data);
      setMessage('Booking confirmed');
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