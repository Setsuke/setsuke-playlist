'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const serve = require('../scripts/serve.cjs');

async function request(url) {
  const response = {
    status: 0,
    headers: {},
    body: null,
    writeHead(status, headers = {}) {
      this.status = status;
      this.headers = headers;
      return this;
    },
    end(body) { this.body = body; },
  };
  await serve({ url }, response);
  return response;
}

test('local server serves HTML, scripts, styles and nested assets with correct types', async () => {
  const cases = {
    '/': 'text/html; charset=utf-8',
    '/js/model.js': 'text/javascript; charset=utf-8',
    '/css/layout.css': 'text/css; charset=utf-8',
    '/assets/posters/empire.webp': 'image/webp',
    '/assets/site/favicon.svg': 'image/svg+xml',
    '/assets/site/hero.png': 'image/png',
  };
  for (const [url, contentType] of Object.entries(cases)) {
    const result = await request(url);
    assert.equal(result.status, 200, url);
    assert.equal(result.headers['Content-Type'], contentType);
    assert.ok(result.body.length > 0);
  }
});

test('local server rejects missing, malformed and non-public paths', async () => {
  for (const url of ['/missing', '/tests/catalog.test.cjs', '/package.json', '/%E0%A4%A', '/../README.md', '/assets/%2e%2e/%2e%2e/README.md']) {
    assert.equal((await request(url)).status, 404, url);
  }
});
