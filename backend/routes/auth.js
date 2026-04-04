import express from 'express';
import bcrypt from 'bcryptjs';
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }

  const db = req.app.get('db');

  db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (user) return res.status(409).json({ message: 'Email already registered.' });

    const passwordHash = bcrypt.hashSync(password, 10);

    db.run(
      'INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)',
      [name, email, passwordHash],
      function (err) {
        if (err) return res.status(500).json({ message: 'Database error.' });
        return res.status(201).json({ id: this.lastID, name, email });
      }
    );
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const db = req.app.get('db');

  db.get('SELECT id, name, email, passwordHash FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const validPassword = bcrypt.compareSync(password, user.passwordHash);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials.' });

    return res.json({ id: user.id, name: user.name, email: user.email });
  });
});

router.get('/users', (req, res) => {
  const db = req.app.get('db');
  db.all('SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }
    res.json(rows);
  });
});

export default router;
