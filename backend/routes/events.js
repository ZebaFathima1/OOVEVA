import express from 'express';
import multer from 'multer';
import path from 'path';
const router = express.Router();

// Configure multer for event images
const eventStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const eventUpload = multer({ storage: eventStorage });

// Get all events
router.get('/', (req, res) => {
  const db = req.app.get('db');
  db.all('SELECT * FROM events ORDER BY date ASC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get single event
router.get('/:id', (req, res) => {
  const db = req.app.get('db');
  db.get('SELECT * FROM events WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else if (!row) {
      res.status(404).json({ message: 'Event not found' });
    } else {
      res.json(row);
    }
  });
});

// Create event
router.post('/', eventUpload.single('image'), (req, res) => {
  const db = req.app.get('db');
  const { title, description, date, time, location } = req.body;
  const image = req.file ? `/uploads/events/${req.file.filename}` : null;

  db.run('INSERT INTO events (title, description, date, time, location, image) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, date, time, location, image], function(err) {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(201).json({ id: this.lastID, ...req.body, image });
    }
  });
});

// Update event
router.put('/:id', eventUpload.single('image'), (req, res) => {
  const db = req.app.get('db');
  const { title, description, date, time, location } = req.body;
  const image = req.file ? `/uploads/events/${req.file.filename}` : req.body.image;

  db.run('UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ?, image = ? WHERE id = ?',
    [title, description, date, time, location, image, req.params.id], function(err) {
    if (err) {
      res.status(400).json({ message: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Event not found' });
    } else {
      res.json({ id: req.params.id, ...req.body, image });
    }
  });
});

// Delete event
router.delete('/:id', (req, res) => {
  const db = req.app.get('db');
  db.run('DELETE FROM events WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ message: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Event not found' });
    } else {
      res.json({ message: 'Event deleted' });
    }
  });
});

export default router;