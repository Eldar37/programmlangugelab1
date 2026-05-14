# PostDesk

Final exam project for React + Redux.

## Stack

- React
- React Router
- Redux Toolkit
- React Redux
- JSONPlaceholder REST API

## Features

- 5 main pages: Dashboard, Posts, Create, Authors, Docs
- Redux Toolkit store with `configureStore`
- Slices with `createSlice`
- Async operations with `createAsyncThunk`
- GET, POST, PUT, DELETE requests
- CRUD for posts
- Search and author filter
- Loading, error, and empty states
- Printable documentation in `docs/project-documentation.md`

## Run

```bash
npm install
npm start
```

The app opens at `http://localhost:3000`.

## Build

```bash
npm run build
```

## Project Structure

```text
src/
  components/
  hooks/
  pages/
  redux/
    store.js
    slices/
  routes/
  services/
  utils/
  App.js
```

## API

The project uses `https://jsonplaceholder.typicode.com`.

- `GET /posts`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `GET /users`
