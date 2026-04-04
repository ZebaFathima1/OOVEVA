import bcrypt from 'bcryptjs';
import { openDb } from '../lib/db.js';
import { jsonBody } from '../lib/body.js';

const sendJson = (res, status, payload) => {
  res.status(status).json(payload);
};

export default async (req, res) => {
  const db = openDb();
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace('/api/auth', '');

  if (req.method === 'POST') {
    const body = await jsonBody(req);

    if (path === '/register') {
      const { name, email, password } = body;
      if (!name || !email || !password) {
        sendJson(res, 400, { message: 'Name, email and password are required.' });
        db.close();
        return;
      }

      db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
          sendJson(res, 500, { message: 'Database error.' });
          db.close();
          return;
        }
        if (user) {
          sendJson(res, 409, { message: 'Email already registered.' });
          db.close();
          return;
        }

        const passwordHash = bcrypt.hashSync(password, 10);
        db.run('INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)', [name, email, passwordHash], function (err) {
          if (err) {
            sendJson(res, 500, { message: 'Database error.' });
          } else {
            sendJson(res, 201, { id: this.lastID, name, email });
          }
          db.close();
        });
      });
    } else if (path === '/login') {
      const { email, password } = body;
      if (!email || !password) {
        sendJson(res, 400, { message: 'Email and password are required.' });
        db.close();
        return;
      }

      db.get('SELECT id, name, email, passwordHash FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
          sendJson(res, 500, { message: 'Database error.' });
          db.close();
          return;
        }
        if (!user) {
          sendJson(res, 401, { message: 'Invalid credentials.' });
          db.close();
          return;
        }

        const validPassword = bcrypt.compareSync(password, user.passwordHash);
        if (!validPassword) {
          sendJson(res, 401, { message: 'Invalid credentials.' });
          db.close();
          return;
        }

        sendJson(res, 200, { id: user.id, name: user.name, email: user.email });
        db.close();
      });
    } else {
      sendJson(res, 404, { message: 'Not found' });
      db.close();
    }
  } else if (req.method === 'GET' && path === '/users') {
    db.all('SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC', (err, rows) => {
      if (err) {
        sendJson(res, 500, { message: 'Database error.' });
      } else {
        sendJson(res, 200, rows);
      }
      db.close();
    });
  } else {
    sendJson(res, 405, { message: 'Method not allowed' });
    db.close();
  }
};
