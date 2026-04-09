import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTodo,
  deleteTodo,
  selectActiveTodo,
  selectActiveTodoId,
  selectTodoById,
  selectTodos,
  setActiveTodo,
  TODO_STATUS_LABELS,
  TODO_STATUS_OPTIONS,
  updateTodo,
} from '../../features/todos/todoSlice';
import './TodoBoard.css';

const EMPTY_TODO_FORM = {
  title: '',
  description: '',
  status: 'planned',
};

const isValidTodoForm = (form) =>
  form.title.trim() && form.description.trim();

const createTodoId = () =>
  `todo-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const formatDate = (value) => {
  if (!value) {
    return 'Нет данных';
  }

  return new Date(value).toLocaleString('ru-RU');
};

function TodoBoard() {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);
  const activeTodoId = useSelector(selectActiveTodoId);
  const activeTodo = useSelector(selectActiveTodo);
  const [createForm, setCreateForm] = useState(EMPTY_TODO_FORM);
  const [editForm, setEditForm] = useState(EMPTY_TODO_FORM);
  const [detailInputId, setDetailInputId] = useState('');
  const [detailLookupId, setDetailLookupId] = useState('');
  const detailTodo = useSelector((state) =>
    detailLookupId ? selectTodoById(state, detailLookupId) : null
  );

  const stats = todos.reduce(
    (result, todo) => {
      result.total += 1;
      result[todo.status] += 1;
      return result;
    },
    {
      total: 0,
      planned: 0,
      'in-progress': 0,
      done: 0,
    }
  );

  useEffect(() => {
    if (!activeTodo) {
      setEditForm(EMPTY_TODO_FORM);
      return;
    }

    setEditForm({
      title: activeTodo.title,
      description: activeTodo.description,
      status: activeTodo.status,
    });
  }, [activeTodo]);

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateSubmit = (event) => {
    event.preventDefault();
    if (!isValidTodoForm(createForm)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const id = createTodoId();

    dispatch(
      addTodo({
        id,
        title: createForm.title.trim(),
        description: createForm.description.trim(),
        status: createForm.status,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
    );

    setCreateForm(EMPTY_TODO_FORM);
    setDetailInputId(id);
    setDetailLookupId(id);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    if (!activeTodo || !isValidTodoForm(editForm)) {
      return;
    }

    dispatch(
      updateTodo({
        id: activeTodo.id,
        changes: {
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          status: editForm.status,
        },
      })
    );
  };

  const handleDelete = () => {
    if (!activeTodo) {
      return;
    }

    dispatch(deleteTodo(activeTodo.id));
  };

  const handleDetailSubmit = (event) => {
    event.preventDefault();
    setDetailLookupId(detailInputId.trim());
  };

  return (
    <section className="todo-board" id="todo">
      <section className="todo-board__hero">
        <div>
          <p className="todo-board__eyebrow">Redux Todo</p>
          <h2>Todo список с useSelector: CREATE, READ, UPDATE, DELETE</h2>
          <p>
            Список читает данные из Redux Store через useSelector, а detail-блок
            позволяет получить задачу по id.
          </p>
        </div>
        <div className="todo-board__stats" aria-label="Статистика задач">
          <article>
            <strong>{stats.total}</strong>
            <span>Всего</span>
          </article>
          <article>
            <strong>{stats.planned}</strong>
            <span>К выполнению</span>
          </article>
          <article>
            <strong>{stats['in-progress']}</strong>
            <span>В работе</span>
          </article>
          <article>
            <strong>{stats.done}</strong>
            <span>Готово</span>
          </article>
        </div>
      </section>

      <section className="todo-board__content">
        <article className="todo-card">
          <div className="todo-card__header">
            <div>
              <h3>READ: список задач</h3>
              <p>Выберите задачу, чтобы открыть detail и редактирование.</p>
            </div>
            <span className="todo-card__badge">{todos.length} шт.</span>
          </div>

          {todos.length > 0 ? (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li className="todo-list__item" key={todo.id}>
                  <button
                    className={todo.id === activeTodoId ? 'is-active' : ''}
                    onClick={() => dispatch(setActiveTodo(todo.id))}
                    type="button"
                  >
                    <span className="todo-list__title">{todo.title}</span>
                    <span className="todo-list__meta">ID: {todo.id}</span>
                    <span className="todo-list__meta">
                      Статус: {TODO_STATUS_LABELS[todo.status]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="todo-card__empty">
              Пока задач нет. Создайте первую задачу в блоке CREATE.
            </p>
          )}
        </article>

        <article className="todo-card">
          <h3>DETAIL: выбранная задача</h3>
          {activeTodo ? (
            <div className="todo-detail">
              <div className="todo-detail__top">
                <h4>{activeTodo.title}</h4>
                <span className="todo-status">
                  {TODO_STATUS_LABELS[activeTodo.status]}
                </span>
              </div>
              <p>{activeTodo.description}</p>
              <dl className="todo-detail__meta">
                <div>
                  <dt>ID</dt>
                  <dd>{activeTodo.id}</dd>
                </div>
                <div>
                  <dt>Создано</dt>
                  <dd>{formatDate(activeTodo.createdAt)}</dd>
                </div>
                <div>
                  <dt>Обновлено</dt>
                  <dd>{formatDate(activeTodo.updatedAt)}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="todo-card__empty">
              Нет активной задачи. Выберите элемент из списка слева.
            </p>
          )}
        </article>
      </section>

      <section className="todo-board__lookup">
        <article className="todo-card">
          <h3>GET BY ID</h3>
          <form className="todo-form" onSubmit={handleDetailSubmit}>
            <label>
              Введите ID задачи
              <input
                name="detailId"
                onChange={(event) => setDetailInputId(event.target.value)}
                placeholder="Например: todo-1710000000000-123"
                type="text"
                value={detailInputId}
              />
            </label>
            <button
              className="todo-button"
              disabled={!detailInputId.trim()}
              type="submit"
            >
              Найти detail
            </button>
          </form>
        </article>

        <article className="todo-card">
          <h3>DETAIL по ID</h3>
          {detailLookupId ? (
            detailTodo ? (
              <div className="todo-detail">
                <div className="todo-detail__top">
                  <h4>{detailTodo.title}</h4>
                  <span className="todo-status">
                    {TODO_STATUS_LABELS[detailTodo.status]}
                  </span>
                </div>
                <p>{detailTodo.description}</p>
                <dl className="todo-detail__meta">
                  <div>
                    <dt>ID</dt>
                    <dd>{detailTodo.id}</dd>
                  </div>
                  <div>
                    <dt>Создано</dt>
                    <dd>{formatDate(detailTodo.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>Обновлено</dt>
                    <dd>{formatDate(detailTodo.updatedAt)}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="todo-card__empty">
                Задача с ID <strong>{detailLookupId}</strong> не найдена.
              </p>
            )
          ) : (
            <p className="todo-card__empty">
              Введите ID и нажмите кнопку, чтобы получить detail.
            </p>
          )}
        </article>
      </section>

      <section className="todo-board__crud">
        <article className="todo-card">
          <h3>CREATE</h3>
          <form className="todo-form" onSubmit={handleCreateSubmit}>
            <label>
              Название
              <input
                name="title"
                onChange={handleCreateChange}
                placeholder="Например: Подготовить отчет"
                type="text"
                value={createForm.title}
              />
            </label>
            <label>
              Описание
              <textarea
                name="description"
                onChange={handleCreateChange}
                placeholder="Короткое описание задачи"
                rows={4}
                value={createForm.description}
              />
            </label>
            <label>
              Статус
              <select
                name="status"
                onChange={handleCreateChange}
                value={createForm.status}
              >
                {TODO_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="todo-button"
              disabled={!isValidTodoForm(createForm)}
              type="submit"
            >
              Добавить задачу
            </button>
          </form>
        </article>

        <article className="todo-card">
          <h3>UPDATE / DELETE</h3>
          <form className="todo-form" onSubmit={handleEditSubmit}>
            <label>
              Название
              <input
                disabled={!activeTodo}
                name="title"
                onChange={handleEditChange}
                placeholder="Название задачи"
                type="text"
                value={editForm.title}
              />
            </label>
            <label>
              Описание
              <textarea
                disabled={!activeTodo}
                name="description"
                onChange={handleEditChange}
                placeholder="Описание задачи"
                rows={4}
                value={editForm.description}
              />
            </label>
            <label>
              Статус
              <select
                disabled={!activeTodo}
                name="status"
                onChange={handleEditChange}
                value={editForm.status}
              >
                {TODO_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="todo-form__actions">
              <button
                className="todo-button"
                disabled={!activeTodo || !isValidTodoForm(editForm)}
                type="submit"
              >
                Сохранить
              </button>
              <button
                className="todo-button todo-button--danger"
                disabled={!activeTodo}
                onClick={handleDelete}
                type="button"
              >
                Удалить
              </button>
            </div>
          </form>
        </article>
      </section>
    </section>
  );
}

export default TodoBoard;
