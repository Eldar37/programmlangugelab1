import { useEffect, useMemo, useState } from 'react';
import { fetchHomeContent } from '../../services/homeContentApi';
import './HomeContent.css';

function HomeContent() {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState('idle');
  const [activeItemId, setActiveItemId] = useState('');

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
        setActiveItemId(data.listDetail.items[0]?.id ?? '');
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
  }, []);

  const activeItem = useMemo(() => {
    if (!content) {
      return null;
    }

    return content.listDetail.items.find((item) => item.id === activeItemId) ?? null;
  }, [content, activeItemId]);

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
        {content.contentBlocks.map((block) => (
          <article className="home-card" key={block.id} id={block.id}>
            <h3>{block.title}</h3>
            <ul>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="list-detail" id={content.listDetail.id}>
        <div className="list-detail__list">
          <h3>{content.listDetail.title}</h3>
          <p>{content.listDetail.description}</p>
          <ul>
            {content.listDetail.items.map((item) => (
              <li key={item.id}>
                <button
                  className={item.id === activeItemId ? 'is-active' : ''}
                  onClick={() => setActiveItemId(item.id)}
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
    </section>
  );
}

export default HomeContent;
