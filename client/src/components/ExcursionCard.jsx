import { useState } from 'react';
import api from '../api';
import ReviewSection from './ReviewSection';
import BookingForm from './BookingForm';

function ExcursionCard({ excursion, user, onDelete, onBooked, onUpdated }) {
  const isAdmin = user && user.role === 'admin';

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(excursion.title);
  const [destination, setDestination] = useState(excursion.destination);
  const [price, setPrice] = useState(excursion.price);
  const [date, setDate] = useState(excursion.date ? excursion.date.slice(0, 10) : '');
  const [description, setDescription] = useState(excursion.description || '');
  const [error, setError] = useState('');

  async function handleSave(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await api.put(`/excursions/${excursion._id}`, {
        title,
        destination,
        price: Number(price),
        date,
        description,
      });
      onUpdated(response.data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update the excursion');
    }
  }

  if (editing) {
    return (
      <article className="card">
        <form onSubmit={handleSave} className="form">
          {error && <p className="error">{error}</p>}
          <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} required />
          <input type="text" value={destination} onChange={(event) => setDestination(event.target.value)} required />
          <input type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} required />
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          <textarea rows="3" value={description} onChange={(event) => setDescription(event.target.value)} />
          <button type="submit">Save</button>
          <button type="button" className="danger" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      </article>
    );
  }

  return (
    <article className="card">
      <div className="card-header">
        <h3>{excursion.title}</h3>
        <span className="price">{excursion.price} TND</span>
      </div>

      <p className="destination">{excursion.destination}</p>

      <p className="meta">
        Date: {excursion.date ? new Date(excursion.date).toLocaleDateString() : 'to be announced'}
      </p>

      {excursion.description && <p>{excursion.description}</p>}

      {isAdmin && (
        <div className="card-actions">
          <button onClick={() => setEditing(true)}>Edit</button>
          <button className="danger" onClick={() => onDelete(excursion._id)}>Delete</button>
        </div>
      )}

      {user && !isAdmin && (
        <BookingForm excursionId={excursion._id} onBooked={onBooked} />
      )}

      <ReviewSection excursionId={excursion._id} user={user} />
    </article>
  );
}

export default ExcursionCard;