import { Request, Response } from 'express';
import db from '../config/db'; // Uvozimo tvoju konfiguraciju baze

export const scanCard = async (req: Request, res: Response): Promise<void> => {
  const { employee_code } = req.body;

  // 1. Sloj validacije na backendu: Provera da li je kôd uopšte poslat
  if (!employee_code || employee_code.trim() === '') {
    res.status(400).json({ message: 'Greška: Kôd zaposlenog je obavezan!' });
    return;
  }

  try {
    // 2. Proveravamo da li zaposleni sa tim kodom uopšte postoji i da li je aktivan
    const [employees]: any = await db.query(
      'SELECT id, first_name, last_name, active FROM employees WHERE employee_code = ?',
      [employee_code]
    );

    if (employees.length === 0) {
      res.status(404).json({ message: 'Zaposleni sa ovim kodom ne postoji u bazi!' });
      return;
    }

    const employee = employees[0];

    // Provera da li je radnik arhiviran (zahtev iz zadatka)
    if (!employee.active) {
      res.status(403).json({ message: `Greška: Zaposleni ${employee.first_name} je arhiviran i ne može se prijaviti!` });
      return;
    }

    // 3. Tražimo POSLEDNJI zapis u attendance tabeli za tog zaposlenog
    const [attendanceRecords]: any = await db.query(
      'SELECT id, check_in, check_out FROM attendance WHERE employee_id = ? ORDER BY id DESC LIMIT 1',
      [employee.id]
    );

    const lastRecord = attendanceRecords[0];

    // 4. LOGIKA KLACKALICE (Check-in / Check-out)
    
    // Scenarijo A: Radnik nema nijedan zapis ILI je zatvorio prethodnu smenu -> RADIMO CHECK-IN
    if (!lastRecord || lastRecord.check_out !== null) {
      await db.query(
        'INSERT INTO attendance (employee_id, check_in) VALUES (?, NOW())',
        [employee.id]
      );
      
      res.status(200).json({
        message: `Dobrodošli, ${employee.first_name} ${employee.last_name}! Uspešno ste se PRIJAVILI.`
      });
      return;
    } 
    
    // Scenarijo B: Radnik ima otvoren zapis (check_out je NULL) -> RADIMO CHECK-OUT
    else {
      await db.query(
        'UPDATE attendance SET check_out = NOW() WHERE id = ?',
        [lastRecord.id]
      );

      res.status(200).json({
        message: `Doviđenja, ${employee.first_name} ${employee.last_name}! Uspešno ste se ODJAVILI.`
      });
      return;
    }

  } catch (error) {
    console.error('Greška na serveru prilikom skeniranja:', error);
    res.status(500).json({ message: 'Interna greška na serveru.' });
  }
};