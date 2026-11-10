-- ========================================================
-- 1. KREIRANJE I ODABIR BAZE PODATAKA
-- ========================================================
DROP DATABASE IF EXISTS attendance_app;
CREATE DATABASE attendance_app;
USE attendance_app;

-- ========================================================
-- 2. KREIRANJE TABELA
-- ========================================================

-- Tabela zaposlenih
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela prisustva (povezana preko id-ja sa employees)
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  check_in DATETIME NOT NULL,
  check_out DATETIME DEFAULT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Tabela administratorskih korisnika (za kontrolu pristupa / login HR-a)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- ========================================================
-- 3. TREĆI SLOJ ZAŠTITE - PROVERA NA NIVOU BAZE (Trigger)
-- ========================================================
DELIMITER $$

CREATE TRIGGER before_attendance_update
BEFORE UPDATE ON attendance
FOR EACH ROW
BEGIN
    -- Ako se radi odjava, trigger sprečava da vreme odjave bude pre vremena prijave
    IF NEW.check_out IS NOT NULL AND NEW.check_out < NEW.check_in THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Greška: Vreme odjave ne može biti pre vremena prijave!';
    END IF;
END$$

DELIMITER ;

-- ========================================================
-- 4. UBACIVANJE TEST PODATAKA ZA ZAPOSLENE
-- ========================================================
INSERT INTO employees (employee_code, first_name, last_name, active) VALUES
('EMP001', 'Marko', 'Marković', 1),   -- ID 1: Redovan radnik
('EMP002', 'Ana', 'Anić', 1),         -- ID 2: Noćne smene
('EMP003', 'Jovan', 'Jovanović', 1),   -- ID 3: Trenutno na poslu (nema check_out)
('EMP004', 'Marija', 'Marić', 1),     -- ID 4: Pola radnog vremena
('EMP005', 'Nikola', 'Nikolić', 0);   -- ID 5: Neaktivan radnik (nema evidenciju)

-- ========================================================
-- 5. UBACIVANJE KORISNIKA ZA HR PRIJAVU (LOGIN)
-- ========================================================
-- Korisničko ime: admin | Lozinka: admin123
INSERT INTO users (username, password) VALUES 
('admin', 'admin123');

-- ========================================================
-- 6. UBACIVANJE RAZNOLIKIH ZAPISA ZA PRISUSTVO (ATTENDANCE)
-- ========================================================

-- Marko Marković (ID = 1) -> 3 dana standardnog rada od 8h do 16h
INSERT INTO attendance (employee_id, check_in, check_out) VALUES
(1, '2026-03-01 08:00:00', '2026-03-01 16:00:00'),
(1, '2026-03-02 07:55:00', '2026-03-02 16:05:00'),
(1, '2026-03-03 08:02:00', '2026-03-03 16:00:00');

-- Ana Anić (ID = 2) -> Noćne smene (check_in kasno uveče, check_out sutradan ujutru)
INSERT INTO attendance (employee_id, check_in, check_out) VALUES
(2, '2026-03-01 22:00:00', '2026-03-02 06:00:00'),
(2, '2026-03-02 21:45:00', '2026-03-03 05:45:00');

-- Jovan Jovanović (ID = 3) -> Prvi dan regularan, drugi dan je još na poslu (check_out je NULL)
INSERT INTO attendance (employee_id, check_in, check_out) VALUES
(3, '2026-03-01 09:00:00', '2026-03-01 17:00:00'),
(3, '2026-03-02 09:00:00', NULL); 

-- Marija Marić (ID = 4) -> Radila skraćeno samo jedan dan
INSERT INTO attendance (employee_id, check_in, check_out) VALUES
(4, '2026-03-01 08:30:00', '2026-03-01 12:30:00');

-- Za Nikolu (ID = 5) namerno ne ubacujemo zapise o prisustvu jer je arhiviran radnik

-- ========================================================
-- 7. POTVRDA UPISA I PROVERA PODATAKA
-- ========================================================
COMMIT;

-- Provera da li je sve uspešno kreirano i napunjeno
SELECT * FROM employees;
SELECT * FROM attendance;
SELECT * FROM users;