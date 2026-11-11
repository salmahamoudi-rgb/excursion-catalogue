import { useState } from 'react';
import api from '../api';

function ExcursionForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/excursions', {
        title,
        destination,
        price: Number(price),
        description,
      });

      onAdd(response.data);
      setTitle('');
      setDestination('');
      setPrice('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add the excursion');
    }
  }

  return (
    <section className="panel">
      <form onSubmit={handleSubmit} className="form">
        <h2>Add an excursion</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Title (e.g. Sahara sunset tour)"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Destination (e.g. Douz)"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price per person (TND)"
          min="0"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          rows="3"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <button type="submit">Add excursion</button>
      </form>
    </section>
  );
}

export default ExcursionForm;