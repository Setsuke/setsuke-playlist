(function (root) {
  'use strict';
  const { escapeHTML: esc, rank, image, header, search, externalLink, songLink, empty } = root.Playlist.components;

  function songRow(catalog, song, selected) {
    const isSelected = song.id === selected;
    return `
      <button class="song-row ${isSelected ? 'selected' : ''}" data-song="${esc(song.id)}" aria-pressed="${isSelected}">
        <span class="rank">${rank(song.rank)}</span>
        ${image(song.cover)}
        <span class="song-title">${esc(song.title)}</span>
        <span class="song-artist">${esc(catalog.artistsById.get(song.artist).name)}</span>
        <span class="song-album">${esc(song.album)}</span>
        <span class="selected-indicator" aria-hidden="true">${isSelected ? '▥' : '›'}</span>
      </button>
    `;
  }

  function detail(catalog, song, list) {
    if (!song) return empty('No song selected', 'Try another search or artist to see song details.');
    const artist = catalog.artistsById.get(song.artist);
    const position = list.findIndex((entry) => entry.id === song.id);
    return `
      ${image(song.cover, `Album cover: ${song.album}`, { eager: true })}
      <div class="tag">#${rank(song.rank)} IN MY TOP ${catalog.songs.length}</div>
      <h2 id="song-detail-title" tabindex="-1">${esc(song.title)}</h2>
      <a class="artist-name" data-artist="${esc(artist.id)}" href="#/artists/${esc(artist.id)}">${esc(artist.name)}</a>
      <div class="metadata">
        <div>Album: ${esc(song.album)}</div>
        <div>Release year: ${esc(song.release)}</div>
      </div>
      <div class="actions">
        ${externalLink(songLink(catalog, song, 'spotify'), 'Find on Spotify ↗')}
        ${externalLink(songLink(catalog, song, 'youtube'), 'YouTube ↗', 'button outline')}
      </div>
      <div class="detail-nav">
        <button data-action="previous" ${position <= 0 ? 'disabled' : ''}>‹ Previous</button>
        <button data-action="next" ${position >= list.length - 1 ? 'disabled' : ''}>Next ›</button>
      </div>
    `;
  }

  function render(catalog, state) {
    const list = root.Playlist.model.filterSongs(catalog, state);
    const selected = catalog.songsById.get(state.selectedSong);
    const filters = [{ id: 'all', name: 'All artists' }, ...catalog.artists];
    return `
      ${header('A PERSONAL SELECTION', catalog.collection.site.heading, 'Five artists. Five songs each. My favorites.')}
      <div class="layout">
        <section class="content-column" aria-label="Song collection">
          <div class="toolbar">
            ${search('Search songs', state.query, 'song-search')}
            <div class="filters" aria-label="Filter by artist">
              ${filters.map((artist) => `
                <button class="pill ${state.artist === artist.id ? 'active' : ''}" data-filter="${esc(artist.id)}" aria-pressed="${state.artist === artist.id}">${esc(artist.name)}</button>
              `).join('')}
            </div>
          </div>
          <div class="list-meta">
            <small id="count">${list.length} of ${catalog.songs.length} songs</small>
            <label>
              <span class="sr-only">Sort songs</span>
              <select id="sort">
                ${[['rank', 'My ranking'], ['title', 'Song title'], ['artist', 'Artist']].map(([value, label]) => `<option value="${value}" ${state.sort === value ? 'selected' : ''}>${label}</option>`).join('')}
              </select>
            </label>
          </div>
          <div class="table-head" aria-hidden="true">
            <span>#</span><span></span><span>TITLE</span><span>ARTIST</span><span class="album-heading">ALBUM</span><span></span>
          </div>
          <div id="song-list">
            ${list.length ? list.map((song) => songRow(catalog, song, state.selectedSong)).join('') : `
              ${empty('No songs found', 'Try another title or artist.')}
              <button class="button" data-action="clear-filters">Clear filters</button>
            `}
          </div>
          <p class="draft">${catalog.artists.length} artists. Five songs each. ${catalog.songs.length} songs in my selection.</p>
        </section>
        <aside class="detail" id="detail" aria-label="Song details">
          ${detail(catalog, selected, list)}
        </aside>
      </div>
    `;
  }

  root.Playlist.views = root.Playlist.views || {};
  root.Playlist.views.songs = { render, songRow, detail };
})(globalThis);
