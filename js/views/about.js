(function (root) {
  'use strict';
  const { escapeHTML: esc, image, header } = root.Playlist.components;

  function render(catalog) {
    const { site } = catalog.collection;
    return `
      ${header('BEHIND THE SELECTION', 'ABOUT', 'A little about me. A lot about music.', 'about-header')}
      <div class="about-grid">
        <figure class="avatar">
          ${image(site.avatar, `${site.alias} avatar`, { eager: true })}
          <figcaption><strong>${esc(site.alias.toUpperCase())}</strong>Software engineer. Music enthusiast.</figcaption>
        </figure>
        <section class="about-copy">
          <h2>Hi, I’m ${esc(site.owner)}.</h2>
          <p class="alias">Also known as ${esc(site.alias)}.</p>
          <p>I built this space to share ${catalog.songs.length} songs that mean something to me: five songs from each of ${catalog.artists.length} artists.</p>
          <h3 class="section-title">A personal selection</h3>
          <p>This is my taste, not an objective ranking. The order may change. The connection remains.</p>
        </section>
      </div>
      <section class="project-card">
        <div><h2>ABOUT THIS PROJECT</h2><p>A small web project where music meets code.</p></div>
        <div class="tech"><span class="pill">HTML</span><span class="pill">CSS</span><span class="pill">JavaScript</span></div>
        <div class="actions">
          <a class="button" href="#/top" data-page="top">Explore my selection ↗</a>
          <button class="button outline" data-action="download-data">Download song data ↓</button>
        </div>
      </section>
      <p class="footer">Made by ${esc(site.alias)} · Inspired by the music I love.</p>
    `;
  }

  root.Playlist.views.about = { render };
})(globalThis);
