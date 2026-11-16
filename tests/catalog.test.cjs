'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const collection = require('../data.js');
const { createCatalog, filterSongs, filterArtists, createState, resolveState } = require('../js/model.js');
const { songLink, escapeHTML } = require('../js/components.js');
const catalog = createCatalog(collection);

test('the exact supplied titles are preserved, with five songs per artist', () => {
  const expected = {
    empire: ['SUCCESS STORY', 'A journey', 'Black to the dreamlight', 'ねぇ', 'EMPiRE is COMiNG'],
    exwhyz: ['FADED', 'BLAZE', 'Our Song', 'Sweet & Sour', 'Drama'],
    bish: ['Orchestra', 'Promise the star', 'My landscape', 'TOMORROW', 'My distinction'],
    lisa: ['Rising Hope', 'Catch the Moment', 'unlasting', 'ADAMAS', 'crossing field'],
    hitsujibungaku: ['more than words', 'Addiction', 'OOPARTS', 'Dogs', '光るとき'],
  };
  assert.equal(catalog.artists.length, 5);
  assert.equal(catalog.songs.length, 25);
  for (const [artist, titles] of Object.entries(expected)) assert.deepEqual(filterSongs(catalog, { artist }).map((song) => song.title), titles);
  assert.deepEqual(catalog.songs.map((song) => song.rank), Array.from({ length: 25 }, (_, index) => index + 1));
});

test('album references, release years and every local asset are valid', () => {
  for (const song of catalog.songs) {
    assert.ok(song.album);
    assert.match(song.release, /^\d{4}$/);
    assert.ok(catalog.albumsById.has(song.albumId));
  }
  const images = [collection.site.avatar, ...catalog.artists.map((artist) => artist.image), ...collection.albums.map((album) => album.cover), 'site/hero.png', 'site/favicon.svg'];
  for (const image of images) assert.ok(fs.existsSync(path.join(__dirname, '..', 'assets', image)), image);
  assert.equal(catalog.songsById.get('success-story').albumId, catalog.songsById.get('a-journey').albumId);
  assert.equal(catalog.songsById.get('ooparts').albumId, catalog.songsById.get('hikaru-toki').albumId);
});

test('search is case insensitive, handles Japanese and does not mutate song order', () => {
  const before = catalog.songs.map((song) => song.id);
  assert.equal(filterSongs(catalog, { query: '  faded  ' })[0].title, 'FADED');
  assert.equal(filterSongs(catalog, { query: '光る' })[0].id, 'hikaru-toki');
  assert.equal(filterSongs(catalog, { query: 'missing-song' }).length, 0);
  filterSongs(catalog, { sort: 'title' });
  assert.deepEqual(catalog.songs.map((song) => song.id), before);
  assert.equal(filterArtists(catalog, ' lisa ')[0].id, 'lisa');
});

test('View all starts with a visible song for each of the five artists', () => {
  for (const artist of catalog.artists) {
    const state = resolveState(catalog, { ...createState(), artist: artist.id, selectedSong: 'success-story' });
    assert.equal(catalog.songsById.get(state.selectedSong).artist, artist.id);
  }
});

test('explicit song navigation overrides incompatible artist and search filters', () => {
  const state = resolveState(catalog, { ...createState(), artist: 'empire', query: 'SUCCESS', selectedSong: 'ooparts' }, { revealSong: true });
  assert.equal(state.selectedSong, 'ooparts');
  assert.equal(state.artist, 'hitsujibungaku');
  assert.equal(state.query, '');
  assert.ok(filterSongs(catalog, state).some((song) => song.id === state.selectedSong));
});

test('search replaces hidden selections and clears the detail for zero matches', () => {
  const state = resolveState(catalog, { ...createState(), selectedSong: 'faded', query: 'OOPARTS' });
  assert.equal(state.selectedSong, 'ooparts');
  assert.equal(resolveState(catalog, { ...state, query: 'missing-song' }).selectedSong, null);
});

test('artist search only selects an artist present in its results', () => {
  const state = resolveState(catalog, { ...createState(), page: 'artists', selectedArtist: 'empire', artistQuery: 'LiSA' });
  assert.equal(state.selectedArtist, 'lisa');
  assert.equal(resolveState(catalog, { ...state, artistQuery: 'missing-artist' }).selectedArtist, null);
  const explicit = resolveState(catalog, { ...state, selectedArtist: 'bish' }, { revealArtist: true });
  assert.equal(explicit.selectedArtist, 'bish');
  assert.equal(explicit.artistQuery, '');
});

test('invalid filters fall back safely and sorting keeps an existing visible selection', () => {
  const state = resolveState(catalog, { ...createState(), artist: 'missing', sort: 'missing', selectedSong: 'dogs' });
  assert.equal(state.artist, 'all');
  assert.equal(state.sort, 'rank');
  assert.equal(resolveState(catalog, { ...state, sort: 'title' }).selectedSong, 'dogs');
});

test('artist links match the supplied channels and Spotify profiles for every song', () => {
  const spotifyIds = { empire: '1APhKAeROy02DedkHnbrXb', exwhyz: '0xOkccCl0pVdhuLBpcHDJx', bish: '0ebinq3ZTOQAJNag4sBTJj', lisa: '0blbVefuxOGltDBa00dspv', hitsujibungaku: '6S8w5rLsEwjN21jQeRES0n' };
  const channels = { exwhyz: 'https://www.youtube.com/@ExWHYZ', lisa: 'https://www.youtube.com/@lisaSMEJ', bish: 'https://www.youtube.com/@BiSH_official', hitsujibungaku: 'https://www.youtube.com/@hitsujibungaku_official' };
  for (const song of catalog.songs) {
    assert.equal(new URL(songLink(catalog, song, 'spotify')).pathname, `/artist/${spotifyIds[song.artist]}`);
    const expected = channels[song.artist] || `https://www.youtube.com/results?search_query=${encodeURIComponent(`EMPiRE ${song.title}`)}`;
    assert.equal(songLink(catalog, song, 'youtube'), expected);
  }
});

test('dynamic text is escaped before insertion in HTML', () => {
  assert.equal(escapeHTML('<img src="x"> &'), '&lt;img src=&quot;x&quot;&gt; &amp;');
});
