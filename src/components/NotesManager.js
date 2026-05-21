import { useState } from 'react';
import { useAppDispatch } from '../hooks/useRedux';
import { addJobNote, deleteJobNote, updateJobNote } from '../redux/slices/jobsSlice';

function formatDate(value) {
  if (!value) {
    return 'без даты';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function NotesManager({ job }) {
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleAdd = () => {
    if (!draft.trim()) {
      return;
    }

    dispatch(addJobNote({ jobId: job.id, text: draft }));
    setDraft('');
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditingText(note.text);
  };

  const saveEdit = () => {
    if (!editingText.trim()) {
      return;
    }

    dispatch(updateJobNote({ jobId: job.id, noteId: editingId, text: editingText }));
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  return (
    <section className="panel notes-panel">
      <div className="page-header page-header--compact">
        <div>
          <p className="page-header__eyebrow">Заметки</p>
          <h2 className="panel__title">CRUD заметок по вакансии</h2>
          <p className="page-header__text">Фиксируйте вопросы, контакты рекрутера и следующие действия.</p>
        </div>
      </div>

      <div className="note-editor">
        <textarea
          className="textarea textarea--compact"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Например: уточнить вилку зарплаты и формат второго интервью."
        />
        <button type="button" className="button button--primary" onClick={handleAdd}>
          Добавить заметку
        </button>
      </div>

      {job.notes.length === 0 && (
        <p className="empty-line">Заметок пока нет. Добавьте первую заметку по этой вакансии.</p>
      )}

      {job.notes.length > 0 && (
        <div className="notes-list">
          {job.notes.map((note) => (
            <article className="note-card" key={note.id}>
              {editingId === note.id ? (
                <>
                  <textarea
                    className="textarea textarea--compact"
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                  />
                  <div className="button-row">
                    <button type="button" className="button button--primary" onClick={saveEdit}>
                      Сохранить
                    </button>
                    <button type="button" className="button button--secondary" onClick={cancelEdit}>
                      Отмена
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="note-card__text">{note.text}</p>
                  <p className="note-card__date">
                    Создано: {formatDate(note.createdAt)}
                    {note.updatedAt ? `, обновлено: ${formatDate(note.updatedAt)}` : ''}
                  </p>
                  <div className="button-row">
                    <button type="button" className="button button--secondary" onClick={() => startEdit(note)}>
                      Редактировать
                    </button>
                    <button
                      type="button"
                      className="button button--danger"
                      onClick={() => dispatch(deleteJobNote({ jobId: job.id, noteId: note.id }))}
                    >
                      Удалить
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default NotesManager;
