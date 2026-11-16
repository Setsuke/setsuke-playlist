(function (root) {
  'use strict';

  function parse(hash) {
    const [path, search = ''] = hash.replace(/^#\/?/, '').split('?');
    const parts = path.split('/');
    const page = parts[0] || 'top';
    const params = new URLSearchParams(search);
    let id;
    try {
      id = parts[1] ? decodeURIComponent(parts[1]) : null;
    } catch {
      return { page: 'not-found' };
    }
    const state = {
      page: page === 'song' ? 'top' : page,
      artist: params.get('artist') || 'all',
      query: params.get('q') || '',
      sort: params.get('sort') || 'rank',
      artistQuery: params.get('aq') || '',
    };
    if (
      !['top', 'song', 'artists', 'about'].includes(page) ||
      parts.length > 2 ||
      (page === 'song' && !id) ||
      (['top', 'about'].includes(page) && id)
    ) {
      state.page = 'not-found';
    }
    if (page === 'song') state.selectedSong = id;
    if (page === 'artists') state.selectedArtist = id;
    return state;
  }

  function format(state) {
    let path = '/top';
    if (state.page === 'top' && state.selectedSong) {
      path = `/song/${encodeURIComponent(state.selectedSong)}`;
    }
    if (state.page === 'artists') {
      path = state.selectedArtist
        ? `/artists/${encodeURIComponent(state.selectedArtist)}`
        : '/artists';
    }
    if (state.page === 'about') path = '/about';
    const params = new URLSearchParams();
    if (state.artist && state.artist !== 'all') params.set('artist', state.artist);
    if (state.query) params.set('q', state.query);
    if (state.sort && state.sort !== 'rank') params.set('sort', state.sort);
    if (state.artistQuery) params.set('aq', state.artistQuery);
    return `#${path}${params.size ? `?${params}` : ''}`;
  }

  const api = { parse, format };
  root.Playlist = root.Playlist || {};
  root.Playlist.router = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
