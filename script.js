const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.GLYYPH_PORT || process.env.PORT || 3002);

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

const ROOT = path.resolve(__dirname);
const INDEX = path.join(ROOT, 'index.html');

function sendFile(res, file) {
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.code === 'ENOENT' ? 'Not Found' : 'glyyph could not read this file.');
      return;
    }
    const ext = path.extname(file).toLowerCase();
    const noCache = ext === '.html' || path.basename(file) === 'sw.js' || path.basename(file) === 'manifest.json';
    res.writeHead(200, {
      'Content-Type': `${MIME[ext] || 'application/octet-stream'}; charset=utf-8`,
      'Cache-Control': noCache ? 'no-cache' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (requestPath === '/' || requestPath === '/index.html' || requestPath === '/index.html') {
    sendFile(res, INDEX);
    return;
  }

  const file = path.resolve(ROOT, `.${requestPath}`);
  if (!file.startsWith(`${ROOT}${path.sep}`)) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Invalid path');
    return;
  }

  fs.stat(file, (err, info) => {
    if (err || !info.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found: ' + requestPath);
      return;
    }
    sendFile(res, file);
  });
});

server.listen(PORT, () => {
  console.log(`glyyph running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => process.exit());
