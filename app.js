(function (root) {
  'use strict';
  const { model, router, views, components, downloadCollection } = root.Playlist;
  const catalog = model.createCatalog(root.collection);
  const main = document.querySelector('main');
  let state = model.createState();

  function rememberFocus() {
    const element = document.activeElement;
    if (!main.contains(element)) return null;
    const attributes = [
      'id', 'data-song', 'data-artist', 'data-filter', 'data-action',
    ];
    const attribute = attributes.find((name) => element.hasAttribute(name));
    if (!attribute) return null;
    return {
      attribute,
      value: element.getAttribute(attribute),
      start: element.selectionStart,
      end: element.selectionEnd,
    };
  }

  function restoreFocus(focus) {
    if (!focus) return;
    const element = Array.from(
      main.querySelectorAll(`[${focus.attribute}]`),
    ).find((item) => item.getAttribute(focus.attribute) === focus.value);
    if (element && !element.disabled) {
      element.focus({ preventScroll: true });
      if (
        typeof focus.start === 'number' &&
        typeof element.setSelectionRange === 'function'
      ) {
        element.setSelectionRange(focus.start, focus.end);
      }
    } else {
      main.querySelector('#song-detail-title, #artist-detail-title')?.focus({ preventScroll: true });
    }
  }

  function render({ focusMain = false, mobileDetail = false } = {}) {
    const focus = focusMain ? null : rememberFocus();
    if (state.page === 'top') {
      main.innerHTML = views.songs.render(catalog, state);
    } else if (state.page === 'artists') {
      main.innerHTML = views.artists.render(catalog, state);
    } else if (state.page === 'about') {
      main.innerHTML = views.about.render(catalog, state);
    } else {
      main.innerHTML = `
        ${components.header('PAGE NOT FOUND', 'NOT FOUND', 'This song, artist or page does not exist.')}
        <a class="button" href="#/top" data-page="top">Back to my selection</a>
      `;
    }

    document.querySelectorAll('.sidebar nav a').forEach((link) => {
      const active = link.dataset.page === state.page;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    const titles = {
      top: `My Top ${catalog.songs.length}`,
      artists: 'Artists',
      about: 'About',
      'not-found': 'Not found',
    };
    document.title = `${titles[state.page]} — ${catalog.collection.site.title}`;
    if (focusMain) main.focus({ preventScroll: true });
    else restoreFocus(focus);
    if (mobileDetail && matchMedia('(max-width: 850px)').matches) {
      const heading = main.querySelector('#song-detail-title, #artist-detail-title');
      heading?.focus({ preventScroll: true });
      main.querySelector('.detail')?.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      });
    }
    let announcement = titles[state.page];
    if (state.page === 'top') {
      const count = model.filterSongs(catalog, state).length;
      const selected = catalog.songsById.get(state.selectedSong);
      announcement = `${count} songs found. ${selected?.title || 'No song selected.'}`;
    } else if (state.page === 'artists') {
      const count = model.filterArtists(catalog, state.artistQuery).length;
      const selected = catalog.artistsById.get(state.selectedArtist);
      announcement = `${count} artists found. ${selected?.name || 'No artist selected.'}`;
    }
    document.querySelector('#live').textContent = announcement;
  }

  function commit(
    candidate,
    { replace = false, revealSong = false, revealArtist = false, ...renderOptions } = {},
  ) {
    state = model.resolveState(catalog, candidate, { revealSong, revealArtist });
    if (state.page !== 'not-found') {
      const hash = router.format(state);
      if (location.hash !== hash) {
        history[replace ? 'replaceState' : 'pushState'](null, '', hash);
      }
    }
    render(renderOptions);
  }

  function followRoute(focusMain = true) {
    const route = router.parse(location.hash);
    const requestedSong = route.selectedSong;
    const requestedArtist = route.selectedArtist;
    if (
      (requestedSong && !catalog.songsById.has(requestedSong)) ||
      (requestedArtist && !catalog.artistsById.has(requestedArtist))
    ) {
      route.page = 'not-found';
    }
    // Explicit URLs take precedence over conflicting song filters.
    commit(
      { ...model.createState(), ...route },
      { replace: true, revealSong: Boolean(requestedSong), focusMain },
    );
  }

  function navigate(patch, options = {}) {
    const next = { ...state, ...patch };
    commit(next, { focusMain: next.page !== state.page, ...options });
  }

  // Stable listeners serve every view; rendering never registers extra handlers.
  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    ) return;
    const control = event.target.closest(
      '[data-song], [data-artist], [data-filter], [data-action], [data-page]',
    );
    if (!control || control.disabled) return;
    if (control.dataset.song) {
      event.preventDefault();
      navigate(
        { page: 'top', selectedSong: control.dataset.song },
        { revealSong: true, mobileDetail: true },
      );
    } else if (control.dataset.artist) {
      event.preventDefault();
      navigate(
        { page: 'artists', selectedArtist: control.dataset.artist },
        { revealArtist: true, mobileDetail: true },
      );
    } else if (control.dataset.filter) {
      navigate({ artist: control.dataset.filter });
    } else if (control.dataset.page) {
      event.preventDefault();
      navigate({ page: control.dataset.page });
    } else {
      const action = control.dataset.action;
      if (action === 'clear-filters') navigate({ artist: 'all', query: '' });
      if (action === 'view-artist-songs') {
        navigate({
          page: 'top',
          artist: state.selectedArtist,
          query: '',
          selectedSong: null,
        });
      }
      if (action === 'download-data') downloadCollection(catalog.collection);
      if (action === 'previous' || action === 'next') {
        const list = model.filterSongs(catalog, state);
        const index = list.findIndex((song) => song.id === state.selectedSong);
        const next = list[index + (action === 'next' ? 1 : -1)];
        if (next) navigate({ selectedSong: next.id });
      }
    }
  });

  function handleSearch(event) {
    if (event.isComposing) return;
    if (event.target.id === 'song-search') {
      navigate({ query: event.target.value }, { replace: true });
    }
    if (event.target.id === 'artist-search') {
      navigate({ artistQuery: event.target.value }, { replace: true });
    }
  }
  main.addEventListener('input', handleSearch);
  // Japanese IME input is rendered only after composition is complete.
  main.addEventListener('compositionend', handleSearch);
  main.addEventListener('change', (event) => {
    if (event.target.id === 'sort') navigate({ sort: event.target.value }, { replace: true });
  });
  window.addEventListener('hashchange', () => followRoute());
  followRoute(false);
})(globalThis);
