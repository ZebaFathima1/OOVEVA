import express from 'express';
import multer from 'multer';
import path from 'path';
const router = express.Router();

// Configure multer for offer images
const offerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/offers/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'offer-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const offerUpload = multer({ storage: offerStorage });

// Get all offers
router.get('/', (req, res) => {
  const db = req.app.get('db');
  db.all('SELECT * FROM offers WHERE isActive = 1 ORDER BY validFrom DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get single offer
router.get('/:id', (req, res) => {
  const db = req.app.get('db');
  db.get('SELECT * FROM offers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else if (!row) {
      res.status(404).json({ message: 'Offer not found' });
    } else {
      res.json(row);
    }
  });
});

// Create offer
router.post('/', offerUpload.single('image'), (req, res) => {
  const db = req.app.get('db');
  const { title, description, discount, discountType, validFrom, validTo, applicableTo } = req.body;
  const image = req.file ? `/uploads/offers/${req.file.filename}` : null;

  db.run('INSERT INTO offers (title, description, discount, discountType, validFrom, validTo, applicableTo, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description, discount, discountType, validFrom, validTo, applicableTo, image], function(err) {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(201).json({ id: this.lastID, ...req.body, image });
    }
  });
});

// Update offer
router.put('/:id', offerUpload.single('image'), (req, res) => {
  const db = req.app.get('db');
  const { title, description, discount, discountType, validFrom, validTo, applicableTo } = req.body;
  const image = req.file ? `/uploads/offers/${req.file.filename}` : req.body.image;

  db.run('UPDATE offers SET title = ?, description = ?, discount = ?, discountType = ?, validFrom = ?, validTo = ?, applicableTo = ?, image = ? WHERE id = ?',
    [title, description, discount, discountType, validFrom, validTo, applicableTo, image, req.params.id], function(err) {
    if (err) {
      res.status(400).json({ message: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Offer not found' });
    } else {
      res.json({ id: req.params.id, ...req.body, image });
    }
  });
});

// Delete offer
router.delete('/:id', (req, res) => {
  const db = req.app.get('db');
  db.run('DELETE FROM offers WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ message: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Offer not found' });
    } else {
      res.json({ message: 'Offer deleted' });
    }
  });
});

export default router;