import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import eventsRouter from './routes/events.js';
import offersRouter from './routes/offers.js';
import authRouter from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isVercel = Boolean(process.env.VERCEL);
const dbFile = isVercel ? '/tmp/database.db' : path.join(__dirname, '../database.db');
const uploadDir = isVercel ? '/tmp/uploads' : path.join(__dirname, 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors());
app.use(express.json());

if (!isVercel) {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const sqlite = sqlite3.verbose();
const db = new sqlite.Database(dbFile, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      location TEXT,
      image TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      discount REAL,
      discountType TEXT,
      validFrom TEXT NOT NULL,
      validTo TEXT NOT NULL,
      applicableTo TEXT,
      image TEXT,
      isActive INTEGER DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

app.set('db', db);
app.set('upload', upload);

app.use('/api/events', eventsRouter);
app.use('/api/offers', offersRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;