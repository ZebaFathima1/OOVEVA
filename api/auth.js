const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

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
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace('/api/auth', '');

  if (req.method === 'POST') {
    const body = await getBody(req);
    if (path === '/register') {
      const { name, email, password } = body;
      if (!name || !email || !password) {
        res.status(400).json({ message: 'Name, email and password are required.' });
        db.close();
        return;
      }

      db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
          res.status(500).json({ message: 'Database error.' });
          db.close();
          return;
        }
        if (user) {
          res.status(409).json({ message: 'Email already registered.' });
          db.close();
          return;
        }

        const passwordHash = bcrypt.hashSync(password, 10);

        db.run(
          'INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)',
          [name, email, passwordHash],
          function (err) {
            if (err) {
              res.status(500).json({ message: 'Database error.' });
              db.close();
              return;
            }
            res.status(201).json({ id: this.lastID, name, email });
            db.close();
          }
        );
      });
    } else if (path === '/login') {
      const { email, password } = body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required.' });
        db.close();
        return;
      }

      db.get('SELECT id, name, email, passwordHash FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
          res.status(500).json({ message: 'Database error.' });
          db.close();
          return;
        }
        if (!user) {
          res.status(401).json({ message: 'Invalid credentials.' });
          db.close();
          return;
        }

        const validPassword = bcrypt.compareSync(password, user.passwordHash);
        if (!validPassword) {
          res.status(401).json({ message: 'Invalid credentials.' });
          db.close();
          return;
        }

        res.json({ id: user.id, name: user.name, email: user.email });
        db.close();
      });
    } else {
      res.status(404).json({ message: 'Not found' });
      db.close();
    }
  } else if (req.method === 'GET' && path === '/users') {
    db.all('SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC', (err, rows) => {
      if (err) {
        res.status(500).json({ message: 'Database error.' });
      } else {
        res.json(rows);
      }
      db.close();
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
    db.close();
  }
}