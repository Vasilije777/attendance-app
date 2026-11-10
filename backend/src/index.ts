import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from 'node-cron';
import db from './config/db'; 

import testRoutes from "./routes/testRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import reportRoutes from "./routes/reportRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Sve rute se uvoze ovde sa prefiksom /api
app.use("/api", testRoutes); // Ovo sada drži /api/login
app.use("/api", employeeRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", reportRoutes);

app.get("/", (req, res) => {
  res.send("Backend radi OK");
});

app.listen(3000, () => {
  console.log("Server radi na portu 3000");
});

// Cron job koji se pokreće SVAKE NOĆI u 23:59
cron.schedule('59 23 * * *', async () => {
  console.log('--- Pokretanje ponoćnog servisa za zaboravljene odjave ---');
  try {
    // SQL upit koji pronalazi sve zapise koji nemaju check_out 
    // i postavlja im check_out da bude jednak vremenu kada su se prijavili (0 radnih sati)
    const query = `
      UPDATE attendance 
      SET check_out = check_in 
      WHERE check_out IS NULL
    `;
    
    // Izvršavamo upit preko db objekta
    await db.query(query);
    
    console.log('✅ Ponoćni servis uspešno zatvorio zaboravljene prijave.');
  } catch (error) {
    console.error('❌ Greška prilikom izvršavanja ponoćnog servisa:', error);
  }
});