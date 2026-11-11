import { useState, useEffect } from 'react';
import api from '../api';

function ReviewSection({ excursionId, user }) {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await api.get(`/reviews/${excursionId}`);
        setReviews(response.data);
      } catch (err) {
        console.error(err);
        setError('Could not load the reviews');
      }
    }
    loadReviews();
  }, [excursionId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post(`/reviews/${excursionId}`, {
        text,
        rating: Number(rating),
      });
      setReviews([response.data, ...reviews]);
      setText('');
      setRating(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add the review');
    }
  }

  async function handleDelete(reviewId) {
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete the review');
    }
  }

  function canDelete(review) {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return review.author && review.author._id === user.id;
  }

  return (
    <div className="reviews">
      <h4>Reviews ({reviews.length})</h4>

      {error && <p className="error">{error}</p>}

      {reviews.map((review) => (
        <div key={review._id} className="review">
          <strong>{review.author ? review.author.name : 'unknown'}</strong>
          <span className="rating"> {review.rating}/5</span>
          <span className="meta"> - {new Date(review.createdAt).toLocaleDateString()}</span>
          {canDelete(review) && (
            <button className="review-delete" onClick={() => handleDelete(review._id)}>
              Delete
            </button>
          )}
          <p>{review.text}</p>
        </div>
      ))}

      {user ? (
        <form onSubmit={handleSubmit} className="review-form">
          <input
            type="text"
            placeholder="Write a review"
            value={text}
            onChange={(event) => setText(event.target.value)}
            required
          />
          <select value={rating} onChange={(event) => setRating(event.target.value)}>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
          <button type="submit">Send</button>
        </form>
      ) : (
        <p className="meta">Log in to write a review.</p>
      )}
    </div>
  );
}

export default ReviewSection;