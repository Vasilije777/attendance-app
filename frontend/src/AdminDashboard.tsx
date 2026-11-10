import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  active: number;
}

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [code, setCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/employees');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_code: code, first_name: firstName, last_name: lastName })
      });
      setCode('');
      setFirstName('');
      setLastName('');
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchiveEmployee = async (id: number) => {
    if (!window.confirm('Da li ste sigurni da želite da arhivirate ovog zaposlenog?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/employees/${id}/archive`, { method: 'PUT' });
      if (res.ok) fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  // NOVA FUNKCIJA: Poziva backend da vrati status na active = 1
  const handleActivateEmployee = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/employees/${id}/activate`, {
        method: 'PUT',
      });
      if (res.ok) {
        fetchEmployees(); // Odmah osvežava tabelu
      } else {
        alert('Greška pri aktivaciji zaposlenog.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>HR Admin Panel</h1>
        <Link to="/report" className="btn btn-info">Pogledaj Izveštaje (Od-Do)</Link>
      </div>

      <div className="card bg-dark border-secondary p-4 mb-5">
        <h3>Dodaj novog zaposlenog</h3>
        <form onSubmit={handleAddEmployee} className="row g-3 mt-2">
          <div className="col-md-3">
            <input type="text" className="form-control bg-secondary text-white" placeholder="Kôd (npr. EMP006)" value={code} onChange={e => setCode(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <input type="text" className="form-control bg-secondary text-white" placeholder="Ime" value={firstName} onChange={e => setFirstName(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <input type="text" className="form-control bg-secondary text-white" placeholder="Prezime" value={lastName} onChange={e => setLastName(e.target.value)} required />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-success w-100">Dodaj</button>
          </div>
        </form>
      </div>

      <h3>Lista zaposlenih</h3>
      <table className="table table-dark table-striped mt-3">
        <thead>
          <tr>
            <th>Kôd</th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Status</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.employee_code}</td>
              <td>{emp.first_name}</td>
              <td>{emp.last_name}</td>
              <td>
                <span className={`badge ${emp.active ? 'bg-success' : 'bg-danger'}`}>
                  {emp.active ? 'Aktivan' : 'Arhiviran'}
                </span>
              </td>
              <td>
                {/* AKCIJA: Ako je aktivan ima dugme Arhiviraj, ako je arhiviran ima dugme Aktiviraj */}
                {emp.active === 1 ? (
                  <button onClick={() => handleArchiveEmployee(emp.id)} className="btn btn-sm btn-danger">
                    Arhiviraj 🗃️
                  </button>
                ) : (
                  <button onClick={() => handleActivateEmployee(emp.id)} className="btn btn-sm btn-success">
                    Aktiviraj ponovo 🔄
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}