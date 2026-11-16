'use strict';
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

async function serve(request, response) {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    const relative = path.relative(root, file);
    const allowed = file === path.join(root, 'index.html') || ['app.js', 'data.js', 'styles.css'].includes(relative) || ['js', 'css', 'assets'].some((folder) => relative.startsWith(folder + path.sep));
    if (!allowed || relative.startsWith('..') || path.isAbsolute(relative)) {
      response.writeHead(404).end('Not found');
      return;
    }
    const body = await fs.readFile(file);
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
}

if (require.main === module) {
  http.createServer(serve).listen(port, '127.0.0.1', () => {
    console.log(`Open http://127.0.0.1:${port}`);
  });
}

module.exports = serve;
