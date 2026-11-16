(function (root) {
  'use strict';
  const { escapeHTML: esc, rank, image, header, search, externalLink, empty } = root.Playlist.components;

  function detail(catalog, artist) {
    if (!artist) return empty('No artist selected', 'Try another artist name.');
    const songs = root.Playlist.model.filterSongs(catalog, { artist: artist.id });
    return `
      ${image(artist.image, artist.name, { eager: true })}
      <div class="tag">ARTIST SPOTLIGHT</div>
      <h2 id="artist-detail-title" tabindex="-1">${esc(artist.name)}</h2>
      <p class="note">${songs.length} songs in my selection.</p>
      <h3 class="section-title">From my Top ${catalog.songs.length}</h3>
      ${songs.map((song) => `
        <a class="mini-song" data-song="${esc(song.id)}" href="#/song/${esc(song.id)}">
          <span class="rank">${rank(song.rank)}</span>
          ${image(song.cover)}
          <strong>${esc(song.title)}</strong><span aria-hidden="true">›</span>
        </a>
      `).join('')}
      <button class="button outline" data-action="view-artist-songs">View all ${esc(artist.name)} songs ›</button>
      ${externalLink(artist.spotify, 'Artist on Spotify ↗', 'external-artist')}
      <p class="draft">Artist photos selected by Setsuke.</p>
    `;
  }

  function card(catalog, artist, selected) {
    const count = catalog.songs.filter((song) => song.artist === artist.id).length;
    return `
      <button class="artist-card ${artist.id === selected ? 'selected' : ''}" data-artist="${esc(artist.id)}" aria-pressed="${artist.id === selected}">
        ${image(artist.image)}
        ${artist.id === selected ? '<span class="selected-badge">Selected</span>' : ''}
        <span class="card-info">
          <strong>${esc(artist.name)}</strong>
          <span class="card-bottom"><span>${count} songs in my selection</span><span>View songs ›</span></span>
        </span>
      </button>
    `;
  }

  function render(catalog, state) {
    const list = root.Playlist.model.filterArtists(catalog, state.artistQuery);
    return `
      ${header('THE PEOPLE BEHIND THE MUSIC', 'ARTISTS', 'The artists behind my favourite songs.')}
      <div class="layout">
        <section class="content-column" aria-label="Artists">
          <div class="toolbar">
            ${search('Search artists', state.artistQuery, 'artist-search')}
            <span class="artist-count" id="artist-count">${list.length} ${list.length === 1 ? 'artist' : 'artists'} in my Top ${catalog.songs.length}</span>
          </div>
          <div class="artist-grid" id="artist-grid">
            ${list.length ? list.map((artist) => card(catalog, artist, state.selectedArtist)).join('') : empty('No artists found', 'Try a different name.')}
          </div>
        </section>
        <aside class="detail artist-detail" aria-label="Artist details">
          ${detail(catalog, catalog.artistsById.get(state.selectedArtist))}
        </aside>
      </div>
    `;
  }

  root.Playlist.views.artists = { render, card, detail };
})(globalThis);
