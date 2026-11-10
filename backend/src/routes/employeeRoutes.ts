import { Router, Request, Response } from "express";
import db from "../config/db";

const router = Router();

// 1. RUTA ZA DODAVANJE NOVOG RADNIKA
router.post("/employees", async (req: Request, res: Response): Promise<void> => {
  try {
    const { employee_code, first_name, last_name } = req.body;

    if (!employee_code || !first_name || !last_name) {
      res.status(400).json({ message: "Sva polja su obavezna!" });
      return;
    }

    await db.query(
      `INSERT INTO employees (employee_code, first_name, last_name)
       VALUES (?, ?, ?)`,
      [employee_code, first_name, last_name]
    );

    res.json({ message: "Zaposleni uspešno kreiran!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru prilikom kreiranja zaposlenog." });
  }
});

// 2. RUTA ZA PRIKAZ SVIH RADNIKA U TABELI
router.get("/employees", async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query("SELECT * FROM employees");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru prilikom čitanja zaposlenih." });
  }
});

// 3. RUTA ZA ARHIVIRANJE (DEAKTIVACIJU) RADNIKA
router.put("/employees/:id/archive", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const [result]: any = await db.query(
      "UPDATE employees SET active = 0 WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Zaposleni nije pronađen u bazi." });
      return;
    }
    res.status(200).json({ message: "Zaposleni je uspešno arhiviran." });
  } catch (error) {
    console.error("Greška pri arhiviranju zaposlenog:", error);
    res.status(500).json({ message: "Interna greška na serveru." });
  }
});

// 4. NOVA RUTA ZA AKTIVACIJU (VRAĆANJE) RADNIKA
router.put("/employees/:id/activate", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Uzimamo ID iz URL-a (npr. /api/employees/4/activate)
  try {
    const [result]: any = await db.query(
      "UPDATE employees SET active = 1 WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Zaposleni nije pronađen u bazi." });
      return;
    }
    res.status(200).json({ message: "Zaposleni je uspešno aktiviran ponovo!" });
  } catch (error) {
    console.error("Greška pri aktivaciji zaposlenog:", error);
    res.status(500).json({ message: "Interna greška na serveru." });
  }
});

export default router;