import React, { useState, useEffect, useRef } from 'react';

export default function Scanner() {
  const [time, setTime] = useState(new Date());
  const [employeeCode, setEmployeeCode] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const inputRef = useRef<HTMLInputElement>(null);

  // Sat koji se osvežava svake sekunde (zahtev iz zadatka)
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Automatski fokus na input polje, tako da radnik ne mora da klikće mišem
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Ako radnik negde klikne na ekranu, automatski vraćamo fokus u skriveno polje
  const handlePageClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeCode.trim()) return;

    try {
      // PROMENJENO: URL je sada postavljen na tačnu rutu /api/scan prema tvom backendu
      const response = await fetch('http://localhost:3000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_code: employeeCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: data.message, isError: false });
      } else {
        setMessage({ text: data.message || 'Greška prilikom skeniranja', isError: true });
      }
    } catch (error) {
      console.error('Greška pri komunikaciji sa serverom:', error);
      setMessage({ text: 'Greška u komunikaciji sa serverom', isError: true });
    }

    setEmployeeCode(''); // Praznimo polje za sledećeg radnika
  };

  return (
    <div 
      onClick={handlePageClick} 
      style={{ 
        height: '100vh', 
        backgroundColor: '#1a1d20', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        cursor: 'default'
      }}
    >
      <div className="text-center container">
        <h1 style={{ fontSize: '4rem', fontWeight: 'bold' }}>
          {time.toLocaleTimeString('sr-RS')}
        </h1>
        <p className="text-muted" style={{ fontSize: '1.5rem' }}>
          {time.toLocaleDateString('sr-RS', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2 className="mt-5 mb-4">Molimo skenirajte Vašu karticu</h2>

        {/* Skrivena forma - stilizovana da bude nevidljiva ili nenapadna */}
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            placeholder="Scan here..."
            className="form-control bg-dark text-white border-secondary text-center"
            style={{ 
              maxWidth: '300px', 
              margin: '0 auto', 
              opacity: 0.3, 
              fontSize: '1.2rem' 
            }}
          />
        </form>

        {/* Prikaz poruke radniku (zeleno za uspeh, crveno za grešku) */}
        {message.text && (
          <div 
            className={`alert ${message.isError ? 'alert-danger' : 'alert-success'} mt-4`} 
            style={{ fontSize: '1.5rem', maxWidth: '500px', margin: '20px auto' }}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}