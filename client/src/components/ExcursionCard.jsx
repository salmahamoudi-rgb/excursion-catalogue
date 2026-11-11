import ReviewSection from './ReviewSection';
import BookingForm from './BookingForm';

function ExcursionCard({ excursion, user, onDelete, onBooked }) {
  const isAdmin = user && user.role === 'admin';

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
        <button className="danger" onClick={() => onDelete(excursion._id)}>
          Delete
        </button>
      )}

      {user && !isAdmin && (
        <BookingForm excursionId={excursion._id} onBooked={onBooked} />
      )}

      <ReviewSection excursionId={excursion._id} user={user} />
    </article>
  );
}

export default ExcursionCard;