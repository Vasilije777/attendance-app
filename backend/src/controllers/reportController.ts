import { Request, Response } from 'express';
import db from '../config/db';

export const getWorkReport = async (req: Request, res: Response): Promise<void> => {
  // Uzimamo query parametre iz URL-a (npr. ?from=2026-03-01&to=2026-03-31)
  const { from, to } = req.query;

  if (!from || !to) {
    res.status(400).json({ message: 'Greška: Parametri "from" i "to" (datumi) su obavezni!' });
    return;
  }

  try {
    // SQL upit koji spaja employees i attendance, filtrira po datumu
    // i računa ukupno provedene sekunde na poslu koristeći TIMESTAMPDIFF
    const query = `
      SELECT 
        e.employee_code,
        e.first_name,
        e.last_name,
        DATE(a.check_in) as work_date,
        TIME(a.check_in) as check_in_time,
        TIME(a.check_out) as check_out_time,
        CASE 
          WHEN a.check_out IS NOT NULL THEN ROUND(TIMESTAMPDIFF(SECOND, a.check_in, a.check_out) / 3600, 2)
          ELSE 0 
        END as hours_worked
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE DATE(a.check_in) BETWEEN ? AND ?
      ORDER BY work_date DESC, e.employee_code ASC
    `;

    const [rows]: any = await db.query(query, [from, to]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Greška prilikom generisanja izveštaja:', error);
    res.status(500).json({ message: 'Interna greška na serveru.' });
  }
};