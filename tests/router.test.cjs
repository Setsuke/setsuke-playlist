'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const router = require('../js/router.js');
const model = require('../js/model.js');
const catalog = model.createCatalog(require('../data.js'));

test('sharing and reloading preserves the song, artist filter, search and ordering', () => {
  const state = model.resolveState(catalog, { ...model.createState(), selectedSong: 'ooparts', artist: 'hitsujibungaku', query: 'OOP', sort: 'title' });
  const restored = model.resolveState(catalog, router.parse(router.format(state)), { revealSong: true });
  assert.deepEqual(restored, state);
});

test('an empty search result remains empty after a URL round trip', () => {
  const state = model.resolveState(catalog, { ...model.createState(), query: 'no-matches-123' });
  const restored = model.resolveState(catalog, router.parse(router.format(state)));
  assert.equal(restored.selectedSong, null);
  assert.equal(restored.query, 'no-matches-123');
});

test('artist search and its selected detail survive a URL round trip', () => {
  const state = model.resolveState(catalog, { ...model.createState(), page: 'artists', selectedArtist: 'empire', artistQuery: 'LiSA' });
  assert.deepEqual(model.resolveState(catalog, router.parse(router.format(state))), state);
});

test('Unicode queries and ampersands round trip without corrupting the URL', () => {
  const state = { ...model.createState(), query: 'ねぇ & 光るとき', artistQuery: 'LiSA & BiSH' };
  const parsed = router.parse(router.format(state));
  assert.equal(parsed.query, state.query);
  assert.equal(parsed.artistQuery, state.artistQuery);
});

test('unknown or malformed routes show a not-found page', () => {
  for (const hash of ['#/unknown', '#/song', '#/song/%E0%A4%A', '#/about/extra', '#/song/faded/extra']) assert.equal(router.parse(hash).page, 'not-found');
  assert.equal(router.parse('').page, 'top');
  assert.equal(router.parse('#/song/faded').selectedSong, 'faded');
});
