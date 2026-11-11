import { useState } from 'react';
import api from '../api';

function AuthForm({ mode, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isRegister = mode === 'register';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const body = isRegister ? { name, email, password } : { email, password };
      const response = await api.post(`/auth/${mode}`, body);
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>{isRegister ? 'Create an account' : 'Log in'}</h2>

      {error && <p className="error">{error}</p>}

      {isRegister && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button type="submit">{isRegister ? 'Register' : 'Log in'}</button>
    </form>
  );
}

export default AuthForm;