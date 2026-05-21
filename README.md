# PostDesk

Финальный экзаменационный проект по React + Redux.

## Стек

- React
- React Router
- Redux Toolkit
- React Redux
- JSONPlaceholder REST API

## Функциональность

- 5 основных страниц: Главная, Публикации, Создать, Авторы, Документация
- Redux Toolkit store через `configureStore`
- Slices через `createSlice`
- Асинхронные операции через `createAsyncThunk`
- GET, POST, PUT, DELETE запросы
- CRUD для публикаций
- Поиск и фильтр по автору
- Состояния загрузки, ошибки и пустого списка
- Печатная документация в `docs/project-documentation.md`

## Запуск

```bash
npm install
npm start
```

Приложение открывается на `http://localhost:5173`.

## Сборка

```bash
npm run build
```

## Структура проекта

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

Проект использует `https://jsonplaceholder.typicode.com`.

- `GET /posts`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `GET /users`
