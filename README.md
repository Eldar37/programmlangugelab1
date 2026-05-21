# IT Job Tracker

Учебный React + Redux Toolkit проект: трекер вакансий для программистов.

## Стек

- React
- React Router
- Redux Toolkit
- React Redux
- JSONPlaceholder REST API как демо-источник данных

## Функциональность

- Вакансии для IT-специалистов
- Поиск и фильтры по компании, статусу отклика, формату работы и сохраненным вакансиям
- Сохраненные вакансии на отдельной странице
- Статусы отклика: в планах, отклик отправлен, скрининг, интервью, оффер, отказ
- CRUD вакансий: создание, просмотр, редактирование и удаление
- CRUD заметок внутри карточки вакансии
- Redux Toolkit store через `configureStore`
- Slices через `createSlice`
- Асинхронные операции через `createAsyncThunk`
- GET, POST, PUT и DELETE запросы
- Loading, error и empty состояния
- Печатная документация в `docs/project-documentation.md`

## Запуск

```bash
npm install
npm start
```

Приложение открывается на `http://localhost:3000`.

## Сборка

```bash
npm run build
```

## Основные маршруты

- `/` - обзор трекера
- `/jobs` - список вакансий и фильтры
- `/jobs/new` - добавление вакансии
- `/jobs/:jobId/edit` - редактирование вакансии и CRUD заметок
- `/saved` - сохраненные вакансии
- `/companies` - компании и рекрутеры
- `/documentation` - краткая документация внутри приложения

## API

Проект использует `https://jsonplaceholder.typicode.com` как учебный REST API.
Данные `/posts` нормализуются в вакансии, а `/users` - в компании.

- `GET /posts`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `GET /users`
