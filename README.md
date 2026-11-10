# Attendance & Working Hours Management System

A full-stack web application designed for tracking employee attendance and automated shift management.

## Tech Stack / Tehnologije
**Frontend: ** React, TypeScript, Bootstrap
**Backend: ** Node.js, Express (REST API)
**Database / Baza:** MySQL

---

## English Description & Features

### 1. Check-In / Check-Out Logic
* Real-time clock and hardware barcode scanner emulation via smart input autofocus (no mouse interaction needed at the entrance terminal).
* Dynamic toggle logic: scanning checks the employee in if no active shift exists, or checks them out if an open shift is found.

### 2. HR Admin Panel & Route Protection
* Protected admin routes with automatic redirection.
**Soft Delete Mechanism:** Employees are archived instead of permanently deleted to preserve work history and report integrity. Archived staff are automatically blocked from checking in.

### 3. Advanced Reports & SQL Filtering
* Custom date range filtering ("From - Do"). Background SQL queries join tables to calculate exact working hours in real-time.

### 4. Automated Cron Jobs
**Midnight Service:** Automatically closes forgotten open shifts at 23:59 with 0 working hours to prevent overlapping days.

---

## Opis projekta na srpskom

Aplikacija za evidenciju prisustva i radnih sati zaposlenih razvijena u Full-Stack arhitekturi.

**Ekran za radnike ("Klackalica"):** Sat u realnom vremenu i automatski fokus na skriveno polje za skeniranje bar-koda. Backend samostalno prepoznaje da li otvara novu smenu ili zatvara postojeću.
**HR Admin Panel:** Zaštićene rute i implementiran *Soft Delete* (logičko brisanje) da se ne gubi istorija rada radnika.
**Izveštaji i SQL:** Filtriranje po opsegu datuma uz napredne SQL upite za računanje radnih sati.
**Ponoćni servis (Cron Job):** Automatski zatvara zaboravljene smene svake noći u 23:59.
