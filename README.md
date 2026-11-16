# Setsuke's 25

A personal music selection: five artists, five songs each. Built with HTML, CSS and vanilla JavaScript, with no frameworks or external dependencies.

## Run

Open `index.html` in your browser. No installation or build step is required.

To use a local server with Node.js 20 or later:

```sh
node scripts/serve.cjs
```

Then open http://127.0.0.1:4173.

## Features

- Search, filter and sort songs.
- Explore artist profiles and album details.
- Open Spotify profiles and YouTube channels.
- Share links to songs with their current filters.
- Download the collection as JSON.
- Responsive layout with keyboard navigation support.

## Structure

- `data.js`: profile, artists, albums and songs.
- `app.js`: application state, events and navigation.
- `js/`: reusable logic, components and page views.
- `css/`: shared, page-specific and responsive styles.
- `assets/`: album covers, artist posters, avatar and site images.
- `tests/`: tests using Node's built-in test runner.
- `scripts/`: optional local server.

## Customize

Edit `data.js` to update the collection, profile, image paths and music links. Albums are defined once and referenced by each song's `albumId`.

## Test

```sh
node --test tests/*.test.cjs
```
