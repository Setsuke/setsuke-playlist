'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const collection = require('../data.js');

test('HTML scripts and styles and every nested CSS import resolve locally', () => {
  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const match of index.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (!match[1].includes('://')) assert.ok(fs.existsSync(path.resolve(root, match[1])), match[1]);
  }
  function checkCSS(file) {
    const css = fs.readFileSync(file, 'utf8');
    for (const match of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
      const target = path.resolve(path.dirname(file), match[1]);
      assert.ok(fs.existsSync(target), `${file}: ${match[1]}`);
      if (target.endsWith('.css')) checkCSS(target);
    }
  }
  checkCSS(path.join(root, 'styles.css'));
});

test('assets are organized, use standard lowercase names and have no unused files', () => {
  const used = new Set([
    collection.site.avatar,
    ...collection.artists.map((artist) => artist.image),
    ...collection.albums.map((album) => album.cover),
    'site/hero.png', 'site/favicon.svg',
  ]);
  const assets = path.join(root, 'assets');
  function visit(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) visit(file);
      else {
        const relative = path.relative(assets, file).split(path.sep).join('/');
        assert.match(relative, /^(albums|posters|profile|site)\/[a-z0-9-]+\.(webp|png|svg)$/);
        assert.ok(used.has(relative), relative);
      }
    }
  }
  visit(assets);
});

test('project uses no frameworks or third-party dependencies', () => {
  const pkg = require('../package.json');
  assert.equal(Object.keys(pkg.dependencies || {}).length, 0);
  assert.equal(Object.keys(pkg.devDependencies || {}).length, 0);
  assert.ok(!fs.existsSync(path.join(root, 'node_modules')));
});
