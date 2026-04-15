# album-api-v2

A Node.js/TypeScript REST API for managing music albums. This is a rewrite of the original `albums-api` (.NET) and is designed to work with the `album-viewer` Vue.js front-end.

## Requirements

- Node.js 18+
- npm 9+

## Getting started

Install dependencies:

```bash
npm install
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the API in development mode with hot reload (no build step required) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled app from `dist/` (requires `npm run build` first) |
| `npm test` | Run all unit tests |

## Running in development

```bash
npm run dev
```

The API will start on **http://localhost:3000**.

## Running in production

```bash
npm run build
npm start
```

## API routes

| Method | Path | Description |
|---|---|---|
| GET | `/albums` | Return all albums |
| GET | `/albums/search?year=N` | Return albums filtered by year |
| GET | `/albums/:id` | Return a single album by ID |
| POST | `/albums` | Create a new album |
| PUT | `/albums/:id` | Update an existing album |
| DELETE | `/albums/:id` | Delete an album |

### Album shape

```json
{
  "id": 1,
  "title": "You, Me and an App Id",
  "artist": {
    "name": "Daprize",
    "birthdate": "1991-05-17",
    "birthPlace": "Seattle, USA"
  },
  "price": 10.99,
  "image_url": "https://aka.ms/albums-daprlogo",
  "year": 2019
}
```

### Create / Update request body

```json
{
  "title": "Album Title",
  "artist": {
    "name": "Artist Name",
    "birthdate": "1990-01-01",
    "birthPlace": "City, Country"
  },
  "price": 12.99,
  "image_url": "https://example.com/cover.png",
  "year": 2025
}
```

## Vue.js front-end compatibility

The `album-viewer` Vite dev server proxies all `/albums` requests to `http://localhost:3000`, so start this API before running the front-end. No extra configuration is needed.

```bash
# Terminal 1 — API
cd album-api-v2
npm run dev

# Terminal 2 — Front-end
cd album-viewer
npm run dev
```

The front-end will be available at **http://localhost:3001**.

## Running tests

```bash
npm test
```

18 tests cover all routes including happy paths, 404s, 400 validation errors, and state persistence.
