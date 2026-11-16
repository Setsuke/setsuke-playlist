'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Small adapter for the controller's DOM boundary. Rendering is exercised as
// real HTML strings; this is not a browser/layout or accessibility simulation.
function startApp(hash = '') {
  const root = path.resolve(__dirname, '..');
  const mainEvents = new Map();
  const documentEvents = new Map();
  const windowEvents = new Map();
  const live = { textContent: '' };
  const main = {
    innerHTML: '',
    contains: () => false,
    querySelector: () => null,
    querySelectorAll: () => [],
    focus() {},
    addEventListener: (name, handler) => mainEvents.set(name, handler),
  };
  const location = { hash };
  const history = {
    entries: [hash],
    pushState(_data, _title, url) {
      location.hash = url;
      this.entries.push(url);
    },
    replaceState(_data, _title, url) {
      location.hash = url;
      this.entries[this.entries.length - 1] = url;
    },
  };
  const document = {
    title: '',
    activeElement: null,
    querySelector: (selector) => selector === 'main' ? main : live,
    querySelectorAll: () => [],
    addEventListener: (name, handler) => documentEvents.set(name, handler),
  };
  const context = {
    document, location, history, URLSearchParams,
    matchMedia: () => ({ matches: false }),
    addEventListener: (name, handler) => windowEvents.set(name, handler),
  };
  context.window = context;
  vm.createContext(context);
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const match of html.matchAll(/<script defer src="([^"]+)"/g)) {
    vm.runInContext(fs.readFileSync(path.join(root, match[1]), 'utf8'), context, { filename: match[1] });
  }
  return {
    main, location, history, document, live,
    click(dataset) {
      const control = { dataset, disabled: false };
      documentEvents.get('click')({
        button: 0,
        target: { closest: () => control },
        preventDefault() { this.defaultPrevented = true; },
      });
    },
    search(id, value, isComposing = false) {
      mainEvents.get('input')({ target: { id, value }, isComposing });
    },
    route(url) {
      location.hash = url;
      windowEvents.get('hashchange')();
    },
    compose(id, value) {
      mainEvents.get('compositionend')({ target: { id, value } });
    },
  };
}

test('controller: View all selects a song from the requested artist', () => {
  const app = startApp();
  app.click({ filter: 'empire' });
  app.click({ page: 'artists' });
  app.click({ artist: 'hitsujibungaku' });
  app.click({ action: 'view-artist-songs' });
  assert.match(app.main.innerHTML, /id="count">5 of 25 songs/);
  assert.match(app.main.innerHTML, /id="song-detail-title"[^>]*>more than words/);
  assert.match(app.location.hash, /^#\/song\/more-than-words\?artist=hitsujibungaku/);
});

test('controller: a song from another artist can open despite a stale filter', () => {
  const app = startApp();
  app.click({ filter: 'empire' });
  app.click({ page: 'artists' });
  app.click({ artist: 'hitsujibungaku' });
  app.click({ song: 'ooparts' });
  assert.match(app.main.innerHTML, /id="song-detail-title"[^>]*>OOPARTS/);
  assert.match(app.location.hash, /^#\/song\/ooparts\?artist=hitsujibungaku/);
  const reloaded = startApp(app.location.hash);
  assert.match(reloaded.main.innerHTML, /id="song-detail-title"[^>]*>OOPARTS/);
});

test('controller: search keeps selection and URL synchronized, including no results', () => {
  const app = startApp('#/song/faded');
  app.search('song-search', 'OOPARTS');
  assert.match(app.location.hash, /^#\/song\/ooparts\?q=OOPARTS/);
  assert.match(app.main.innerHTML, /id="song-detail-title"[^>]*>OOPARTS/);
  assert.equal(app.history.entries.length, 1, 'typing replaces history instead of adding every keystroke');
  app.search('song-search', 'no-results-123');
  assert.match(app.location.hash, /^#\/top\?q=no-results-123/);
  assert.ok(!app.main.innerHTML.includes('id="song-detail-title"'));
  app.click({ action: 'clear-filters' });
  assert.match(app.main.innerHTML, /id="count">25 of 25 songs/);
});

test('controller: artist search updates its detail and survives reload', () => {
  const app = startApp('#/artists/empire');
  app.search('artist-search', 'LiSA');
  assert.match(app.main.innerHTML, /id="artist-detail-title"[^>]*>LiSA/);
  assert.match(app.location.hash, /^#\/artists\/lisa\?aq=LiSA/);
  assert.match(startApp(app.location.hash).main.innerHTML, /id="artist-detail-title"[^>]*>LiSA/);
  app.search('artist-search', 'missing-artist');
  assert.ok(!app.main.innerHTML.includes('id="artist-detail-title"'));
});

test('controller: next, previous and history navigation restore the correct detail', () => {
  const app = startApp('#/song/faded?artist=exwhyz');
  const first = app.location.hash;
  app.click({ action: 'next' });
  assert.match(app.main.innerHTML, /id="song-detail-title"[^>]*>BLAZE/);
  app.click({ action: 'previous' });
  assert.match(app.main.innerHTML, /id="song-detail-title"[^>]*>FADED/);
  app.route(first);
  assert.match(app.main.innerHTML, /id="song-detail-title"[^>]*>FADED/);
});

test('controller: Japanese composition is not interrupted by rendering', () => {
  const app = startApp();
  const original = app.main.innerHTML;
  app.search('song-search', 'ね', true);
  assert.equal(app.main.innerHTML, original);
  app.compose('song-search', 'ねぇ');
  assert.match(app.main.innerHTML, /id="song-detail-title"[^>]*>ねぇ/);
});

test('controller: invalid songs and artists show a recoverable not-found page', () => {
  for (const route of ['#/song/unknown-song', '#/artists/unknown-artist']) {
    const app = startApp(route);
    assert.match(app.main.innerHTML, /PAGE NOT FOUND/);
    app.click({ page: 'top' });
    assert.match(app.main.innerHTML, /id="count">25 of 25 songs/);
  }
});
