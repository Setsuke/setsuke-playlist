(function (root) {
  'use strict';

  function downloadCollection(collection) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'setsukes-collection.json';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  root.Playlist.downloadCollection = downloadCollection;
})(globalThis);
