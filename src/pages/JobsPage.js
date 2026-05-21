import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import PageHeader from '../components/PageHeader';
import StateBox from '../components/StateBox';
import { useInitialData } from '../hooks/useInitialData';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import {
  fetchJobs,
  selectFilteredJobs,
  selectJobs,
  selectJobsError,
  selectJobsLoading,
} from '../redux/slices/jobsSlice';

function JobsPage() {
  useInitialData();
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectJobs);
  const filteredJobs = useAppSelector(selectFilteredJobs);
  const loading = useAppSelector(selectJobsLoading);
  const error = useAppSelector(selectJobsError);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Вакансии"
        title="Трекер IT-вакансий"
        text="Список вакансий с поиском, фильтрами, сохранением, быстрым изменением статуса отклика и переходом к заметкам."
        action={
          <Link className="button button--primary" to="/jobs/new">
            Новая вакансия
          </Link>
        }
      />

      <JobFilters />

      {loading && jobs.length === 0 && (
        <StateBox title="Загрузка вакансий" text="Получаем демо-данные из REST API и приводим их к формату вакансий." type="loading" />
      )}

      {error && (
        <StateBox
          title="Ошибка запроса"
          text={error}
          type="error"
          action={
            <button className="button button--secondary" type="button" onClick={() => dispatch(fetchJobs())}>
              Повторить
            </button>
          }
        />
      )}

      {!loading && !error && jobs.length === 0 && (
        <StateBox title="Список пуст" text="Добавьте первую вакансию, чтобы начать вести трекер." />
      )}

      {!loading && !error && jobs.length > 0 && filteredJobs.length === 0 && (
        <StateBox title="Ничего не найдено" text="Измените поисковый запрос, статус, формат или фильтр сохраненных." />
      )}

      {filteredJobs.length > 0 && (
        <section className="job-grid">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </section>
      )}
    </div>
  );
}

export default JobsPage;
