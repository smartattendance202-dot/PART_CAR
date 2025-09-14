const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const Database = require('better-sqlite3');

const PORT = 5000; // server port

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

// Paths
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'src', 'uploads');
const imagesDir = path.join(uploadsDir, 'images');

// Ensure dirs exist
const ensureDirs = () => {
  [dataDir, uploadsDir, imagesDir].forEach((dir) => {
    try { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); } catch { }
  });
};
ensureDirs();

// SQLite init
const dbFile = path.join(dataDir, 'db.sqlite');
const db = new Database(dbFile);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  models TEXT,
  image TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS branches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  coordinates TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data_json TEXT NOT NULL
);

INSERT OR IGNORE INTO settings(id, data_json)
VALUES (1, '{"aboutText":"","contactNumbers":"","whatsappNumber":""}');
`);

// Helpers
const collectJSON = (req, cb) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    try { cb(JSON.parse(body || '{}')); } catch { cb({}); }
  });
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method || 'GET';

  const sendJSON = (status, obj, extraHeaders = {}) => {
    res.writeHead(status, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...extraHeaders,
    });
    res.end(typeof obj === 'string' ? obj : JSON.stringify(obj));
  };

  if (method === 'OPTIONS') {
    return sendJSON(200, { ok: true });
  }

  // ===================== API =====================
  if (parsedUrl.pathname.startsWith('/api/')) {
    // Health
    if (parsedUrl.pathname === '/api/health' && method === 'GET') {
      return sendJSON(200, { ok: true });
    }

    // Products
    if (parsedUrl.pathname === '/api/products' && method === 'GET') {
      const rows = db.prepare('SELECT id, name, models, image FROM products ORDER BY id DESC').all();
      return sendJSON(200, rows);
    }
    if (parsedUrl.pathname === '/api/products' && method === 'POST') {
      return collectJSON(req, (body) => {
        const { name = '', models = '', image = '' } = body || {};
        const info = db
          .prepare('INSERT INTO products (name, models, image) VALUES (?, ?, ?)')
          .run(name, models, image);
        return sendJSON(201, { id: info.lastInsertRowid, name, models, image });
      });
    }
    if (/^\/api\/products\/\d+$/.test(parsedUrl.pathname) && method === 'PUT') {
      const id = Number(parsedUrl.pathname.split('/').pop());
      return collectJSON(req, (body) => {
        const { name = '', models = '', image = '' } = body || {};
        const info = db
          .prepare('UPDATE products SET name=?, models=?, image=? WHERE id=?')
          .run(name, models, image, id);
        if (info.changes === 0) return sendJSON(404, { error: 'Not found' });
        return sendJSON(200, { id, name, models, image });
      });
    }
    if (/^\/api\/products\/\d+$/.test(parsedUrl.pathname) && method === 'DELETE') {
      const id = Number(parsedUrl.pathname.split('/').pop());
      const info = db.prepare('DELETE FROM products WHERE id=?').run(id);
      if (info.changes === 0) return sendJSON(404, { error: 'Not found' });
      return sendJSON(200, { ok: true });
    }

    // Branches
    if (parsedUrl.pathname === '/api/branches' && method === 'GET') {
      const rows = db.prepare('SELECT id, name, address, phone, coordinates FROM branches ORDER BY id DESC').all();
      return sendJSON(200, rows);
    }
    if (parsedUrl.pathname === '/api/branches' && method === 'POST') {
      return collectJSON(req, (body) => {
        const { name = '', address = '', phone = '', coordinates = '' } = body || {};
        const info = db
          .prepare('INSERT INTO branches (name, address, phone, coordinates) VALUES (?, ?, ?, ?)')
          .run(name, address, phone, coordinates);
        return sendJSON(201, { id: info.lastInsertRowid, name, address, phone, coordinates });
      });
    }
    if (/^\/api\/branches\/\d+$/.test(parsedUrl.pathname) && method === 'PUT') {
      const id = Number(parsedUrl.pathname.split('/').pop());
      return collectJSON(req, (body) => {
        const { name = '', address = '', phone = '', coordinates = '' } = body || {};
        const info = db
          .prepare('UPDATE branches SET name=?, address=?, phone=?, coordinates=? WHERE id=?')
          .run(name, address, phone, coordinates, id);
        if (info.changes === 0) return sendJSON(404, { error: 'Not found' });
        return sendJSON(200, { id, name, address, phone, coordinates });
      });
    }
    if (/^\/api\/branches\/\d+$/.test(parsedUrl.pathname) && method === 'DELETE') {
      const id = Number(parsedUrl.pathname.split('/').pop());
      const info = db.prepare('DELETE FROM branches WHERE id=?').run(id);
      if (info.changes === 0) return sendJSON(404, { error: 'Not found' });
      return sendJSON(200, { ok: true });
    }

    // Settings
    if (parsedUrl.pathname === '/api/settings' && method === 'GET') {
      const row = db.prepare('SELECT data_json FROM settings WHERE id=1').get();
      const data = row?.data_json ? JSON.parse(row.data_json) : {};
      return sendJSON(200, data);
    }
    if (parsedUrl.pathname === '/api/settings' && method === 'PUT') {
      return collectJSON(req, (body) => {
        const json = JSON.stringify(body || {});
        db.prepare('UPDATE settings SET data_json=? WHERE id=1').run(json);
        return sendJSON(200, body || {});
      });
    }

    // Upload image from data URL
    if (parsedUrl.pathname === '/api/upload-image' && method === 'POST') {
      return collectJSON(req, (body) => {
        try {
          ensureDirs();
          const dataUrl = body.dataUrl || '';
          const match = dataUrl.match(/^data:(image\/(png|jpe?g));base64,(.+)$/i);
          if (!match) return sendJSON(400, { error: 'Invalid dataUrl' });
          const ext = match[2].toLowerCase().startsWith('jp') ? 'jpg' : 'png';
          const buffer = Buffer.from(match[3], 'base64');
          const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
          const filePath = path.join(imagesDir, filename);
          fs.writeFileSync(filePath, buffer);
          return sendJSON(201, { url: `/uploads/images/${filename}` });
        } catch (e) {
          return sendJSON(500, { error: 'Upload failed' });
        }
      });
    }

    // No API match
    return sendJSON(404, { error: 'Not found' });
  }

  // ===================== Static Files =====================
  let pathname = `.${parsedUrl.pathname}`;

  if (pathname === './') {
    pathname = './src/index.html';
  } else {
    pathname = `./src${parsedUrl.pathname}`;
  }

  // Redirect /admin to dashboard
  if (pathname === './src/admin') {
    res.writeHead(301, { Location: '/admin/dashboard.html' });
    res.end();
    return;
  }

  const ext = path.parse(pathname).ext;
  const map = mimeTypes[ext] || 'text/plain';

  fs.readFile(pathname, (err, data) => {
    if (err) {
      if (ext === '') {
        fs.readFile(`${pathname}.html`, (err2, data2) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(
              '<!DOCTYPE html><html><body><h1>404 Not Found</h1><p>The requested file could not be found.</p></body></html>'
            );
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data2);
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<!DOCTYPE html><html><body><h1>404 Not Found</h1><p>The requested file could not be found.</p></body></html>');
      }
    } else {
      res.writeHead(200, { 'Content-Type': map });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Website (User): http://localhost:${PORT}`);
  console.log(`Admin Panel: http://localhost:${PORT}/admin/dashboard.html`);
  console.log('Press Ctrl+C to stop the server');
});
