import { useState, useEffect } from 'react';
import api from './api';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import ExcursionForm from './components/ExcursionForm';
import ExcursionCard from './components/ExcursionCard';
import BookingList from './components/BookingList';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [excursions, setExcursions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [showAuth, setShowAuth] = useState(true);

  useEffect(() => {
    async function loadExcursions() {
      try {
        const response = await api.get('/excursions');
        setExcursions(response.data);
      } catch (err) {
        console.error(err);
        setError('Could not load the excursions. Is the server running?');
      } finally {
        setLoading(false);
      }
    }
    loadExcursions();
  }, []);

  useEffect(() => {
    if (!user) return;

    async function loadBookings() {
      try {
        const response = await api.get('/bookings');
        setBookings(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadBookings();
  }, [user]);

  function handleLogin(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setBookings([]);
  }

  function handleAdd(newExcursion) {
    setExcursions([newExcursion, ...excursions]);
  }

  function handleBooked(newBooking) {
    setBookings([newBooking, ...bookings]);
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/excursions/${id}`);
      setExcursions(excursions.filter((excursion) => excursion._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete the excursion');
    }
  }

  const isAdmin = user && user.role === 'admin';

  return (
    <div className="app">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setShowAuth(!showAuth)}
      />

      <main className="container">
        {error && <p className="error">{error}</p>}

        {!user && showAuth && (
          <section className="panel">
            <AuthForm mode={authMode} onSuccess={handleLogin} />
            <button
              className="link-button"
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            >
              {authMode === 'login' ? 'No account yet? Register' : 'Already have an account? Log in'}
            </button>
          </section>
        )}

        {isAdmin && <ExcursionForm onAdd={handleAdd} />}

        {loading && <p className="light">Loading...</p>}

        {excursions.length > 0 && <h2 className="section-title">Our excursions</h2>}

        <div className="grid">
          {excursions.map((excursion) => (
            <ExcursionCard
              key={excursion._id}
              excursion={excursion}
              user={user}
              onDelete={handleDelete}
              onBooked={handleBooked}
            />
          ))}
        </div>

        {user && <BookingList bookings={bookings} isAdmin={isAdmin} />}
      </main>

      <footer className="footer">
        <section id="about">
          <h3>About</h3>
          <p>Excursion Catalogue presents the excursions of a travel agency in Tunisia. Visitors can browse them; members can book and share reviews.</p>
        </section>
        <section id="contact">
          <h3>Contact</h3>
          <p>Sousse, Tunisia</p>
          <p>contact@excursion-catalogue.tn</p>
        </section>
      </footer>
    </div>
  );
}

export default App;