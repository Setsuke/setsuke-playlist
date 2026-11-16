(function (root) {
  'use strict';
  const escapeHTML = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
          character
        ],
    );
  const rank = (value) => String(value).padStart(2, '0');

  function image(filename, alt = '', { className = '', eager = false } = {}) {
    return `<img class="${escapeHTML(className)}" src="assets/${escapeHTML(filename)}" alt="${escapeHTML(alt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
  }

  function header(eyebrow, title, subtitle, className = '') {
    return `
      <header class="page-header ${escapeHTML(className)}">
        <div class="eyebrow">${escapeHTML(eyebrow)}</div>
        <h1>${escapeHTML(title)}</h1>
        <p>${escapeHTML(subtitle)}</p>
      </header>
    `;
  }

  function search(label, value, id) {
    return `
      <label class="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>
        </svg>
        <span class="sr-only">${escapeHTML(label)}</span>
        <input type="search" id="${escapeHTML(id)}" placeholder="${escapeHTML(label)}…" value="${escapeHTML(value)}" autocomplete="off">
      </label>
    `;
  }

  function externalLink(href, label, className = 'button') {
    return `<a class="${escapeHTML(className)}" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`;
  }

  function songLink(catalog, song, service) {
    const artist = catalog.artistsById.get(song.artist);
    if (service === 'spotify') return artist.spotify;
    if (service === 'youtube') {
      const query = encodeURIComponent(`${artist.name} ${song.title}`);
      return artist.youtube || `https://www.youtube.com/results?search_query=${query}`;
    }
    throw new Error(`Unknown music service: ${service}`);
  }

  function empty(title, text) {
    return `<div class="empty"><strong>${escapeHTML(title)}</strong><p>${escapeHTML(text)}</p></div>`;
  }

  const api = {
    escapeHTML,
    rank,
    image,
    header,
    search,
    externalLink,
    songLink,
    empty,
  };
  root.Playlist = root.Playlist || {};
  root.Playlist.components = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
