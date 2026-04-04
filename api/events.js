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

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace('/api/events', '');

  if (req.method === 'GET') {
    if (path === '' || path === '/') {
      db.all('SELECT * FROM events ORDER BY date ASC', [], (err, rows) => {
        if (err) {
          res.status(500).json({ message: err.message });
        } else {
          res.json(rows);
        }
        db.close();
      });
    } else {
      const id = path.slice(1);
      db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
        if (err) {
          res.status(500).json({ message: err.message });
        } else if (!row) {
          res.status(404).json({ message: 'Event not found' });
        } else {
          res.json(row);
        }
        db.close();
      });
    }
  } else {
    const body = await getBody(req);
    if (req.method === 'POST') {
      const { title, description, date, time, location } = body;
      const image = null;
      db.run('INSERT INTO events (title, description, date, time, location, image) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, date, time, location, image], function(err) {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          res.status(201).json({ id: this.lastID, title, description, date, time, location, image });
        }
        db.close();
      });
    } else if (req.method === 'PUT') {
      const id = path.slice(1);
      const { title, description, date, time, location } = body;
      const image = body.image;
      db.run('UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ?, image = ? WHERE id = ?',
        [title, description, date, time, location, image, id], function(err) {
        if (err) {
          res.status(400).json({ message: err.message });
        } else if (this.changes === 0) {
          res.status(404).json({ message: 'Event not found' });
        } else {
          res.json({ id, title, description, date, time, location, image });
        }
        db.close();
      });
    } else if (req.method === 'DELETE') {
      const id = path.slice(1);
      db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
        if (err) {
          res.status(500).json({ message: err.message });
        } else if (this.changes === 0) {
          res.status(404).json({ message: 'Event not found' });
        } else {
          res.json({ message: 'Event deleted' });
        }
        db.close();
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
}