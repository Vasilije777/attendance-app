import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        // Čuvamo u lokalnoj memoriji pretraživača da je admin ulogovan
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin'); // Vodimo ga na admin panel
      } else {
        setError(data.message || 'Neuspešna prijava');
      }
    } catch (err) {
      setError('Greška u komunikaciji sa serverom.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="card bg-dark border-secondary p-4 text-white" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">HR Prijava</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Korisničko ime:</label>
            <input 
              type="text" 
              className="form-control bg-secondary text-white border-0" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Lozinka:</label>
            <input 
              type="password" 
              className="form-control bg-secondary text-white border-0" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">Prijavi se</button>
        </form>
      </div>
    </div>
  );
}