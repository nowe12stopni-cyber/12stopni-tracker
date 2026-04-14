const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const STATE_FILE = path.join(__dirname, 'state.json');
const HTML_FILE = path.join(__dirname, 'index.html');
const API_SECRET = process.env.API_SECRET || 'wynajem2026';

// Init state file if not exists
if (!fs.existsSync(STATE_FILE)) {
  fs.writeFileSync(STATE_FILE, JSON.stringify({ data: null, updatedAt: null, updatedBy: null }));
}

function readState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); }
  catch(e) { return { data: null }; }
}

function writeState(data, ip) {
  const state = { data, updatedAt: new Date().toISOString(), updatedBy: ip };
  fs.writeFileSync(STATE_FILE, JSON.stringify(state));
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Secret');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // Auth check for API
  const secret = req.headers['x-secret'];

  // GET /api/state — fetch current state
  if (req.method === 'GET' && req.url === '/api/state') {
    if (secret !== API_SECRET) { res.writeHead(401); res.end('Unauthorized'); return; }
    const state = readState();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(state));
    return;
  }

  // POST /api/state — save state
  if (req.method === 'POST' && req.url === '/api/state') {
    if (secret !== API_SECRET) { res.writeHead(401); res.end('Unauthorized'); return; }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        writeState(data, req.socket.remoteAddress);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, savedAt: new Date().toISOString() }));
      } catch(e) {
        res.writeHead(400); res.end('Bad JSON');
      }
    });
    return;
  }

  // GET /health
  if (req.url === '/health') {
    res.writeHead(200); res.end('OK');
    return;
  }

  // Serve index.html for all other routes
  if (req.method === 'GET') {
    try {
      const html = fs.readFileSync(HTML_FILE);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch(e) {
      res.writeHead(404); res.end('index.html not found');
    }
    return;
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`State file: ${STATE_FILE}`);
});
