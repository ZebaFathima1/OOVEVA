import { openDb } from '../lib/db.js';
import { jsonBody } from '../lib/body.js';

const sendJson = (res, status, payload) => {
  res.status(status).json(payload);
};

export default async (req, res) => {
  const db = openDb();
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace('/api/events', '');

  if (req.method === 'GET') {
    if (path === '' || path === '/') {
      db.all('SELECT * FROM events ORDER BY date ASC', [], (err, rows) => {
        if (err) {
          sendJson(res, 500, { message: err.message });
        } else {
          sendJson(res, 200, rows);
        }
        db.close();
      });
      return;
    }

    const id = path.slice(1);
    db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
      if (err) {
        sendJson(res, 500, { message: err.message });
      } else if (!row) {
        sendJson(res, 404, { message: 'Event not found' });
      } else {
        sendJson(res, 200, row);
      }
      db.close();
    });
  } else if (req.method === 'POST') {
    const body = await jsonBody(req);
    const { title, description, date, time, location } = body;
    const image = body.image || null;

    db.run(
      'INSERT INTO events (title, description, date, time, location, image) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, date, time, location, image],
      function (err) {
        if (err) {
          sendJson(res, 400, { message: err.message });
        } else {
          sendJson(res, 201, { id: this.lastID, title, description, date, time, location, image });
        }
        db.close();
      }
    );
  } else if (req.method === 'PUT') {
    const body = await jsonBody(req);
    const id = path.slice(1);
    const { title, description, date, time, location, image } = body;

    db.run(
      'UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ?, image = ? WHERE id = ?',
      [title, description, date, time, location, image, id],
      function (err) {
        if (err) {
          sendJson(res, 400, { message: err.message });
        } else if (this.changes === 0) {
          sendJson(res, 404, { message: 'Event not found' });
        } else {
          sendJson(res, 200, { id, title, description, date, time, location, image });
        }
        db.close();
      }
    );
  } else if (req.method === 'DELETE') {
    const id = path.slice(1);
    db.run('DELETE FROM events WHERE id = ?', [id], function (err) {
      if (err) {
        sendJson(res, 500, { message: err.message });
      } else if (this.changes === 0) {
        sendJson(res, 404, { message: 'Event not found' });
      } else {
        sendJson(res, 200, { message: 'Event deleted' });
      }
      db.close();
    });
  } else {
    sendJson(res, 405, { message: 'Method not allowed' });
    db.close();
  }
};
