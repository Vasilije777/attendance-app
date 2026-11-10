
import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Vasilije123",
  database: "attendance_app"
});

export default db;