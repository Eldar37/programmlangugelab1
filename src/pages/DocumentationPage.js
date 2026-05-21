import PageHeader from '../components/PageHeader';

function DocumentationPage() {
  return (
    <div className="page">
      <PageHeader
        eyebrow="Документация"
        title="Описание проекта"
        text="Краткая справка по архитектуре IT Job Tracker. Полная версия для печати находится в docs/project-documentation.md."
      />

      <section className="panel docs">
        <div>
          <h2>Назначение</h2>
          <p>
            IT Job Tracker помогает программисту вести список вакансий, сохранять интересные позиции, менять
            статусы отклика и хранить заметки по каждому процессу найма.
          </p>
        </div>
        <div>
          <h2>Redux архитектура</h2>
          <p>
            Store настроен через configureStore. Состояние разделено на jobsSlice и companiesSlice. Компоненты
            читают данные через useSelector и запускают actions через useDispatch, вынесенные в локальные hooks.
          </p>
        </div>
        <div>
          <h2>Функциональность</h2>
          <ul>
            <li>fetchJobs загружает вакансии из REST API и нормализует их под IT-тематику.</li>
            <li>createJob, updateJob и deleteJob реализуют CRUD вакансий через async thunk.</li>
            <li>Фильтры работают по поиску, компании, статусу, формату и признаку сохраненной вакансии.</li>
            <li>toggleJobSaved и setJobStatus меняют сохранение и статус отклика прямо в карточке.</li>
            <li>addJobNote, updateJobNote и deleteJobNote реализуют CRUD заметок внутри Redux state.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default DocumentationPage;
