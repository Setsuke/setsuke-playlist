(function (root) {
  'use strict';

  function createCatalog(collection) {
    const artistsById = new Map(
      collection.artists.map((artist) => [artist.id, artist]),
    );
    const albumsById = new Map(
      collection.albums.map((album) => [album.id, album]),
    );
    const songs = collection.songs.map((song) => {
      const album = albumsById.get(song.albumId);
      if (!artistsById.has(song.artist) || !album || album.artist !== song.artist) {
        throw new Error(`Invalid artist or album for song: ${song.id}`);
      }
      return {
        ...song,
        album: album.name,
        release: album.release,
        cover: album.cover,
      };
    });
    const songsById = new Map(songs.map((song) => [song.id, song]));
    if (
      artistsById.size !== collection.artists.length ||
      albumsById.size !== collection.albums.length ||
      songsById.size !== songs.length
    ) {
      throw new Error('Collection IDs must be unique.');
    }
    return {
      collection,
      artists: collection.artists,
      songs,
      artistsById,
      albumsById,
      songsById,
    };
  }

  function filterSongs(
    catalog,
    { artist = 'all', query = '', sort = 'rank' } = {},
  ) {
    const search = query.trim().toLocaleLowerCase();
    return catalog.songs
      .filter(
        (song) =>
          (artist === 'all' || song.artist === artist) &&
          song.title.toLocaleLowerCase().includes(search),
      )
      .sort((a, b) => {
        if (sort === 'title') {
          return a.title.localeCompare(b.title) || a.rank - b.rank;
        }
        if (sort === 'artist') {
          return (
            catalog.artistsById.get(a.artist).name.localeCompare(
              catalog.artistsById.get(b.artist).name,
            ) || a.rank - b.rank
          );
        }
        return a.rank - b.rank;
      });
  }

  function filterArtists(catalog, query = '') {
    const search = query.trim().toLocaleLowerCase();
    return catalog.artists.filter((artist) =>
      artist.name.toLocaleLowerCase().includes(search),
    );
  }

  function createState() {
    return {
      page: 'top',
      artist: 'all',
      query: '',
      sort: 'rank',
      selectedSong: null,
      artistQuery: '',
      selectedArtist: null,
    };
  }

  // Resolve selection in one place so the list and its detail always agree.
  function resolveState(
    catalog,
    candidate,
    { revealSong = false, revealArtist = false } = {},
  ) {
    const state = { ...createState(), ...candidate };
    if (!catalog.artistsById.has(state.artist)) state.artist = 'all';
    if (!['rank', 'title', 'artist'].includes(state.sort)) state.sort = 'rank';
    if (state.page === 'top') {
      const requested = catalog.songsById.get(state.selectedSong);
      if (revealSong && requested) {
        if (state.artist !== 'all' && state.artist !== requested.artist) {
          state.artist = requested.artist;
        }
        const matchesQuery = requested.title
          .toLocaleLowerCase()
          .includes(state.query.trim().toLocaleLowerCase());
        if (!matchesQuery) state.query = '';
      }
      const list = filterSongs(catalog, state);
      state.selectedSong =
        (list.find((song) => song.id === state.selectedSong) || list[0])?.id || null;
    }
    if (state.page === 'artists') {
      if (
        revealArtist &&
        catalog.artistsById.has(state.selectedArtist) &&
        !filterArtists(catalog, state.artistQuery).some(
          (artist) => artist.id === state.selectedArtist,
        )
      ) {
        state.artistQuery = '';
      }
      const list = filterArtists(catalog, state.artistQuery);
      state.selectedArtist =
        (list.find((artist) => artist.id === state.selectedArtist) || list[0])?.id || null;
    }
    return state;
  }

  const api = {
    createCatalog,
    filterSongs,
    filterArtists,
    createState,
    resolveState,
  };
  root.Playlist = root.Playlist || {};
  root.Playlist.model = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
