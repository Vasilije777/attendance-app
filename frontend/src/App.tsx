import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Scanner from './Scanner';
import AdminDashboard from './AdminDashboard';
import Report from './Report';
import Login from './Login';

// Komponenta čuvar - ne da nikome bez logina da vidi stranicu
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav className="navbar navbar-expand navbar-dark bg-black px-3 d-flex justify-content-between">
        <div className="navbar-nav">
          <Link className="nav-link" to="/">⏱️ Ekran za Radnike (Ulaz)</Link>
          <Link className="nav-link" to="/admin">💼 Admin Panel (HR)</Link>
        </div>
        {localStorage.getItem('isAuthenticated') === 'true' && (
          <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>Odjavi se 🏃</button>
        )}
      </nav>

      <Routes>
        {/* Javna ruta za radnike na ulazu */}
        <Route path="/" element={<Scanner />} />
        
        {/* Ruta za login */}
        <Route path="/login" element={<Login />} />
        
        {/* Zaštićene admin rute */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/report" element={
          <ProtectedRoute>
            <Report />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}