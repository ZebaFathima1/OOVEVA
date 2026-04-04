const sqlite3 = require('sqlite3').verbose();

const getBody = (req) => new Promise((resolve, reject) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      resolve(JSON.parse(body));
    } catch (e) {
      resolve({});
    }
  });
});

export default async (req, res) => {
  const db = new sqlite3.Database('/tmp/database.db');
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

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace('/api/offers', '');

  if (req.method === 'GET') {
    if (path === '' || path === '/') {
      db.all('SELECT * FROM offers WHERE isActive = 1 ORDER BY validFrom DESC', [], (err, rows) => {
        if (err) {
          res.status(500).json({ message: err.message });
        } else {
          res.json(rows);
        }
        db.close();
      });
    } else {
      const id = path.slice(1);
      db.get('SELECT * FROM offers WHERE id = ?', [id], (err, row) => {
        if (err) {
          res.status(500).json({ message: err.message });
        } else if (!row) {
          res.status(404).json({ message: 'Offer not found' });
        } else {
          res.json(row);
        }
        db.close();
      });
    }
  } else {
    const body = await getBody(req);
    if (req.method === 'POST') {
      const { title, description, discount, discountType, validFrom, validTo, applicableTo } = body;
      const image = null;
      db.run('INSERT INTO offers (title, description, discount, discountType, validFrom, validTo, applicableTo, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, description, discount, discountType, validFrom, validTo, applicableTo, image], function(err) {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          res.status(201).json({ id: this.lastID, title, description, discount, discountType, validFrom, validTo, applicableTo, image });
        }
        db.close();
      });
    } else if (req.method === 'PUT') {
      const id = path.slice(1);
      const { title, description, discount, discountType, validFrom, validTo, applicableTo } = body;
      const image = body.image;
      db.run('UPDATE offers SET title = ?, description = ?, discount = ?, discountType = ?, validFrom = ?, validTo = ?, applicableTo = ?, image = ? WHERE id = ?',
        [title, description, discount, discountType, validFrom, validTo, applicableTo, image, id], function(err) {
        if (err) {
          res.status(400).json({ message: err.message });
        } else if (this.changes === 0) {
          res.status(404).json({ message: 'Offer not found' });
        } else {
          res.json({ id, title, description, discount, discountType, validFrom, validTo, applicableTo, image });
        }
        db.close();
      });
    } else if (req.method === 'DELETE') {
      const id = path.slice(1);
      db.run('DELETE FROM offers WHERE id = ?', [id], function(err) {
        if (err) {
          res.status(500).json({ message: err.message });
        } else if (this.changes === 0) {
          res.status(404).json({ message: 'Offer not found' });
        } else {
          res.json({ message: 'Offer deleted' });
        }
        db.close();
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
}