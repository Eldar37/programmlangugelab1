import PageHeader from '../components/PageHeader';

function DocumentationPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="Документация"
        title="Описание проекта"
        text="Это краткая справка внутри приложения. Печатная документация на пять страниц хранится в docs/project-documentation.md."
      />

      <section className="panel docs">
        <div>
          <h2>Redux архитектура</h2>
          <p>
            Store настроен в src/redux/store.js. Для публикаций и авторов созданы отдельные slices
            в src/redux/slices. Компоненты читают данные через useSelector и запускают actions через
            useDispatch, вынесенные в небольшие hooks в src/hooks.
          </p>
        </div>
        <div>
          <h2>Асинхронный поток</h2>
          <ul>
            <li>fetchPosts отправляет GET /posts и заполняет список публикаций.</li>
            <li>createPost отправляет POST /posts и добавляет локальный элемент в начало списка.</li>
            <li>updatePost отправляет PUT /posts/:id для API-публикаций и обновляет локальные записи тем же thunk.</li>
            <li>deletePost отправляет DELETE /posts/:id для API-публикаций и удаляет запись из Redux.</li>
          </ul>
        </div>
        <div>
          <h2>Состояния приложения</h2>
          <p>
            Состояния загрузки, ошибки и пустого списка отображаются на главной странице, в публикациях, создании,
            редактировании и авторах. Поиск и фильтр по автору хранятся в Redux, поэтому состояние
            интерфейса остается предсказуемым.
          </p>
        </div>
      </section>
    </div>
  );
}

export default DocumentationPage;
