function BookingList({ bookings, isAdmin, onCancel }) {
  return (
    <section className="bookings">
      <h2>{isAdmin ? 'All bookings' : 'My bookings'}</h2>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      {bookings.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Excursion</th>
              <th>Date</th>
              <th>People</th>
              <th>Total</th>
              {isAdmin && <th>Client</th>}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.excursion ? booking.excursion.title : 'Deleted excursion'}</td>
                <td>
                  {booking.excursion && booking.excursion.date
                    ? new Date(booking.excursion.date).toLocaleDateString()
                    : '-'}
                </td>
                <td>{booking.people}</td>
                <td>{booking.excursion ? booking.excursion.price * booking.people : 0} TND</td>
                {isAdmin && <td>{booking.user ? booking.user.name : 'unknown'}</td>}
                <td>
                  <button className="review-delete" onClick={() => onCancel(booking._id)}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default BookingList;