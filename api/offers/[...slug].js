import { openDb } from '../lib/db.js';
import { jsonBody } from '../lib/body.js';

const sendJson = (res, status, payload) => {
  res.status(status).json(payload);
};

export default async (req, res) => {
  const db = openDb();
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace('/api/offers', '');

  if (req.method === 'GET') {
    if (path === '' || path === '/') {
      db.all('SELECT * FROM offers WHERE isActive = 1 ORDER BY validFrom DESC', [], (err, rows) => {
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
    db.get('SELECT * FROM offers WHERE id = ?', [id], (err, row) => {
      if (err) {
        sendJson(res, 500, { message: err.message });
      } else if (!row) {
        sendJson(res, 404, { message: 'Offer not found' });
      } else {
        sendJson(res, 200, row);
      }
      db.close();
    });
  } else if (req.method === 'POST') {
    const body = await jsonBody(req);
    const { title, description, discount, discountType, validFrom, validTo, applicableTo, image } = body;

    db.run(
      'INSERT INTO offers (title, description, discount, discountType, validFrom, validTo, applicableTo, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, discount, discountType, validFrom, validTo, applicableTo, image || null],
      function (err) {
        if (err) {
          sendJson(res, 400, { message: err.message });
        } else {
          sendJson(res, 201, { id: this.lastID, title, description, discount, discountType, validFrom, validTo, applicableTo, image });
        }
        db.close();
      }
    );
  } else if (req.method === 'PUT') {
    const body = await jsonBody(req);
    const id = path.slice(1);
    const { title, description, discount, discountType, validFrom, validTo, applicableTo, image } = body;

    db.run(
      'UPDATE offers SET title = ?, description = ?, discount = ?, discountType = ?, validFrom = ?, validTo = ?, applicableTo = ?, image = ? WHERE id = ?',
      [title, description, discount, discountType, validFrom, validTo, applicableTo, image, id],
      function (err) {
        if (err) {
          sendJson(res, 400, { message: err.message });
        } else if (this.changes === 0) {
          sendJson(res, 404, { message: 'Offer not found' });
        } else {
          sendJson(res, 200, { id, title, description, discount, discountType, validFrom, validTo, applicableTo, image });
        }
        db.close();
      }
    );
  } else if (req.method === 'DELETE') {
    const id = path.slice(1);
    db.run('DELETE FROM offers WHERE id = ?', [id], function (err) {
      if (err) {
        sendJson(res, 500, { message: err.message });
      } else if (this.changes === 0) {
        sendJson(res, 404, { message: 'Offer not found' });
      } else {
        sendJson(res, 200, { message: 'Offer deleted' });
      }
      db.close();
    });
  } else {
    sendJson(res, 405, { message: 'Method not allowed' });
    db.close();
  }
};
