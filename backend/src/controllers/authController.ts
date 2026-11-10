import { Request, Response } from 'express';
import db from '../config/db';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  // Validacija ulaznih podataka
  if (!username || !password) {
    res.status(400).json({ message: 'Sva polja su obavezna!' });
    return;
  }

  try {
    // Proveravamo bazu podataka
    const [rows]: any = await db.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    // Ako baza vrati prazan niz, znači da korisnik ne postoji sa tom šifrom
    if (!rows || rows.length === 0) {
      res.status(401).json({ message: 'Pogrešno korisničko ime ili lozinka!' });
      return;
    }

    // Uspešan login
    res.status(200).json({ 
      message: 'Uspešna prijava!', 
      user: { username: rows[0].username } 
    });
  } catch (error) {
    // Ako se desi bilo kakva greška (npr. nema tabele), ispiši je u terminalu
    console.error('KATASTROFALNA GREŠKA NA BACKENDU:', error);
    res.status(500).json({ message: 'Interna greška na serveru.' });
  }
};