import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ReportRow {
  employee_code: string;
  first_name: string;
  last_name: string;
  work_date: string;
  check_in_time: string;
  check_out_time: string;
  hours_worked: number;
}

export default function Report() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/report?from=${fromDate}&to=${toDate}`);
      const data = await res.json();
      if (res.ok) {
        setReportData(data);
      } else {
        alert(data.message || 'Greška pri preuzimanju izveštaja');
      }
    } catch (err) {
      console.error('Greška:', err);
      alert('Sistemska greška pri komunikaciji sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Izveštaj o radnom vremenu</h1>
        <Link to="/admin" className="btn btn-secondary">Nazad na Admin Panel</Link>
      </div>

      {/* Forme za odabir datuma */}
      <div className="card bg-dark border-secondary p-4 mb-4">
        <form onSubmit={handleFetchReport} className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Datum OD:</label>
            <input 
              type="date" 
              className="form-control bg-secondary text-white border-none" 
              value={fromDate} 
              onChange={e => setFromDate(e.target.value)} 
              required 
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Datum DO:</label>
            <input 
              type="date" 
              className="form-control bg-secondary text-white border-none" 
              value={toDate} 
              onChange={e => setToDate(e.target.value)} 
              required 
            />
          </div>
          <div className="col-md-4">
            <button type="submit" className="btn btn-info w-100" disabled={loading}>
              {loading ? 'Učitavanje...' : 'Generiši Izveštaj'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabela sa rezultatima */}
      <h3>Rezultati pretrage</h3>
      <div className="table-responsive">
        <table className="table table-dark table-striped mt-3">
          <thead>
            <tr>
              <th>Kôd radnika</th>
              <th>Ime</th>
              <th>Prezime</th>
              <th>Datum</th>
              <th>Prijava</th>
              <th>Odjava</th>
              <th>Ukupno (Sati)</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  Nema podataka za izabrani period. Izaberite datume i kliknite na dugme.
                </td>
              </tr>
            ) : (
              reportData.map((row, index) => (
                <tr key={index}>
                  <td>{row.employee_code}</td>
                  <td>{row.first_name}</td>
                  <td>{row.last_name}</td>
                  <td>{new Date(row.work_date).toLocaleDateString('sr-RS')}</td>
                  <td>{row.check_in_time}</td>
                  <td>{row.check_out_time || <span className="text-warning">Nije odjavljen</span>}</td>
                  <td>
                    <span className="badge bg-primary fs-6">
                      {row.hours_worked} h
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}