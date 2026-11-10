import { Request, Response } from 'express';
import db from '../config/db';

// Nova funkcija koja postavlja active = 0 za izabranog radnika
export const archiveEmployee = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Uzimamo ID radnika iz URL-a (npr. /api/employees/5)

  try {
    const [result]: any = await db.query(
      'UPDATE employees SET active = 0 WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Zaposleni nije pronađen.' });
      return;
    }

    res.status(200).json({ message: 'Zaposleni je uspešno arhiviran (deaktiviran).' });
  } catch (error) {
    console.error('Greška pri arhiviranju zaposlenog:', error);
    res.status(500).json({ message: 'Interna greška na serveru.' });
  }
};