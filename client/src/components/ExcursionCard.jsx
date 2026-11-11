import ReviewSection from './ReviewSection';

function ExcursionCard({ excursion, user, onDelete }) {
  const isAdmin = user && user.role === 'admin';

  return (
    <article className="card">
      <div className="card-header">
        <h3>{excursion.title}</h3>
        <span className="price">{excursion.price} TND</span>
      </div>

      <p className="destination">{excursion.destination}</p>

      {excursion.description && <p>{excursion.description}</p>}

      {isAdmin && (
        <button className="danger" onClick={() => onDelete(excursion._id)}>
          Delete
        </button>
      )}

      <ReviewSection excursionId={excursion._id} user={user} />
    </article>
  );
}

export default ExcursionCard;