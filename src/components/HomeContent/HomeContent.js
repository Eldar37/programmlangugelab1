import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addService,
  deleteService,
  selectActiveServiceId,
  selectServices,
  setActiveService,
  setServices,
  updateService,
} from '../../features/services/servicesSlice';
import { fetchHomeContent } from '../../services/homeContentApi';
import './HomeContent.css';

const EMPTY_SERVICE_FORM = {
  name: '',
  summary: '',
  details: '',
};

const EMPTY_BLOCK_FORM = {
  title: '',
  itemsText: '',
};

const isValidServiceForm = (form) =>
  form.name.trim() && form.summary.trim() && form.details.trim();

const parseBlockItems = (value) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

function HomeContent() {
  const dispatch = useDispatch();
  const services = useSelector(selectServices);
  const activeItemId = useSelector(selectActiveServiceId);

  const [content, setContent] = useState(null);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [activeBlockId, setActiveBlockId] = useState('');
  const [status, setStatus] = useState('idle');
  const [createForm, setCreateForm] = useState(EMPTY_SERVICE_FORM);
  const [editForm, setEditForm] = useState(EMPTY_SERVICE_FORM);
  const [blockForm, setBlockForm] = useState(EMPTY_BLOCK_FORM);

  useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      setStatus('loading');

      try {
        const data = await fetchHomeContent();
        if (!mounted) {
          return;
        }

        setContent(data);
        setContentBlocks(data.contentBlocks);
        setActiveBlockId(data.contentBlocks[0]?.id ?? '');
        dispatch(setServices(data.listDetail.items));
        setStatus('success');
      } catch (error) {
        if (!mounted) {
          return;
        }

        setStatus('error');
      }
    };

    loadContent();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const activeItem = useMemo(() => {
    return services.find((item) => item.id === activeItemId) ?? null;
  }, [services, activeItemId]);

  const activeBlock = useMemo(() => {
    return contentBlocks.find((block) => block.id === activeBlockId) ?? null;
  }, [contentBlocks, activeBlockId]);

  useEffect(() => {
    if (!activeItem) {
      setEditForm(EMPTY_SERVICE_FORM);
      return;
    }

    setEditForm({
      name: activeItem.name,
      summary: activeItem.summary,
      details: activeItem.details,
    });
  }, [activeItem]);

  useEffect(() => {
    if (!activeBlock) {
      setBlockForm(EMPTY_BLOCK_FORM);
      return;
    }

    setBlockForm({
      title: activeBlock.title,
      itemsText: activeBlock.items.join('\n'),
    });
  }, [activeBlock]);

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleCreateSubmit = (event) => {
    event.preventDefault();
    if (!isValidServiceForm(createForm)) {
      return;
    }

    const id = `service-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    dispatch(
      addService({
        id,
        name: createForm.name.trim(),
        summary: createForm.summary.trim(),
        details: createForm.details.trim(),
      })
    );
    setCreateForm(EMPTY_SERVICE_FORM);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    if (!activeItem || !isValidServiceForm(editForm)) {
      return;
    }

    dispatch(
      updateService({
        id: activeItem.id,
        changes: {
          name: editForm.name.trim(),
          summary: editForm.summary.trim(),
          details: editForm.details.trim(),
        },
      })
    );
  };

  const handleDelete = () => {
    if (!activeItem) {
      return;
    }

    dispatch(deleteService(activeItem.id));
  };

  const handleBlockChange = (event) => {
    const { name, value } = event.target;
    setBlockForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleBlockSubmit = (event) => {
    event.preventDefault();
    if (!activeBlock || !blockForm.title.trim()) {
      return;
    }

    setContentBlocks((previous) =>
      previous.map((block) => {
        if (block.id !== activeBlock.id) {
          return block;
        }

        return {
          ...block,
          title: blockForm.title.trim(),
          items: parseBlockItems(blockForm.itemsText),
        };
      })
    );
  };

  if (status === 'loading') {
    return (
      <section className="home-content">
        <p className="home-content__state">Загрузка контента...</p>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="home-content">
        <p className="home-content__state">Не удалось загрузить JSON-контент.</p>
      </section>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <section className="home-content">
      <section className="home-content__hero" id={content.hero.id}>
        <h2>{content.hero.title}</h2>
        <p>{content.hero.description}</p>
      </section>

      <section className="home-content__grid">
        {contentBlocks.map((block) => (
          <article className="home-card" key={block.id} id={block.id}>
            {block.items.length > 0 ? (
              <>
                <h3>{block.title}</h3>
                <ul>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="home-card__single">{block.title}</p>
            )}
          </article>
        ))}
      </section>

      <section className="content-editor">
        <h3>Редактирование контент-блоков</h3>
        <form className="crud-form" onSubmit={handleBlockSubmit}>
          <label>
            Блок
            <select
              onChange={(event) => setActiveBlockId(event.target.value)}
              value={activeBlockId}
            >
              {contentBlocks.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Заголовок
            <input
              name="title"
              onChange={handleBlockChange}
              placeholder="Введите заголовок"
              type="text"
              value={blockForm.title}
            />
          </label>
          <label>
            Пункты (каждый с новой строки)
            <textarea
              name="itemsText"
              onChange={handleBlockChange}
              placeholder="Пункт 1&#10;Пункт 2&#10;Пункт 3"
              rows={5}
              value={blockForm.itemsText}
            />
          </label>
          <button
            className="crud-button"
            disabled={!activeBlock || !blockForm.title.trim()}
            type="submit"
          >
            Сохранить изменения
          </button>
        </form>
      </section>

      <section className="list-detail" id={content.listDetail.id}>
        <div className="list-detail__list">
          <h3>{content.listDetail.title}</h3>
          <p>{content.listDetail.description}</p>
          <ul>
            {services.map((item) => (
              <li key={item.id}>
                <button
                  className={item.id === activeItemId ? 'is-active' : ''}
                  onClick={() => dispatch(setActiveService(item.id))}
                  type="button"
                >
                  {item.name}
                </button>
                <span>{item.summary}</span>
              </li>
            ))}
          </ul>
        </div>

        <article className="list-detail__detail">
          {activeItem ? (
            <>
              <h4>{activeItem.name}</h4>
              <p>{activeItem.details}</p>
            </>
          ) : (
            <p>Выберите элемент из списка.</p>
          )}
        </article>
      </section>

      <section className="crud-panel">
        <article className="crud-card">
          <h3>Создать сервис</h3>
          <form className="crud-form" onSubmit={handleCreateSubmit}>
            <label>
              Название
              <input
                name="name"
                onChange={handleCreateChange}
                placeholder="Название сервиса"
                type="text"
                value={createForm.name}
              />
            </label>
            <label>
              Кратко
              <input
                name="summary"
                onChange={handleCreateChange}
                placeholder="Краткое описание"
                type="text"
                value={createForm.summary}
              />
            </label>
            <label>
              Подробно
              <textarea
                name="details"
                onChange={handleCreateChange}
                placeholder="Подробное описание"
                rows={4}
                value={createForm.details}
              />
            </label>
            <button
              className="crud-button"
              disabled={!isValidServiceForm(createForm)}
              type="submit"
            >
              Добавить
            </button>
          </form>
        </article>

        <article className="crud-card">
          <h3>Изменить или удалить выбранный сервис</h3>
          <form className="crud-form" onSubmit={handleEditSubmit}>
            <label>
              Название
              <input
                disabled={!activeItem}
                name="name"
                onChange={handleEditChange}
                placeholder="Название сервиса"
                type="text"
                value={editForm.name}
              />
            </label>
            <label>
              Кратко
              <input
                disabled={!activeItem}
                name="summary"
                onChange={handleEditChange}
                placeholder="Краткое описание"
                type="text"
                value={editForm.summary}
              />
            </label>
            <label>
              Подробно
              <textarea
                disabled={!activeItem}
                name="details"
                onChange={handleEditChange}
                placeholder="Подробное описание"
                rows={4}
                value={editForm.details}
              />
            </label>
            <div className="crud-form__actions">
              <button
                className="crud-button"
                disabled={!activeItem || !isValidServiceForm(editForm)}
                type="submit"
              >
                Сохранить
              </button>
              <button
                className="crud-button crud-button--danger"
                disabled={!activeItem}
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

export default HomeContent;
