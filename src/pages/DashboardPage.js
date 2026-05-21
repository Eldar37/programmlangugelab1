import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import StateBox from '../components/StateBox';
import { useInitialData } from '../hooks/useInitialData';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import {
  fetchJobs,
  selectJobStats,
  selectJobs,
  selectJobsError,
  selectJobsLoading,
} from '../redux/slices/jobsSlice';

function DashboardPage() {
  useInitialData();
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectJobs);
  const stats = useAppSelector(selectJobStats);
  const loading = useAppSelector(selectJobsLoading);
  const error = useAppSelector(selectJobsError);
  const latestJobs = jobs.slice(0, 4);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Обзор"
        title="IT Job Tracker"
        text="Трекер вакансий для программистов: список позиций, фильтры, сохраненные вакансии, статусы откликов и CRUD заметок по каждому процессу."
        action={
          <Link className="button button--primary" to="/jobs/new">
            Добавить вакансию
          </Link>
        }
      />

      <section className="metrics-grid">
        <MetricCard label="Всего вакансий" value={stats.total} hint="Позиции в текущем Redux state" />
        <MetricCard label="Сохраненные" value={stats.saved} hint="Отмечены для быстрого доступа" />
        <MetricCard label="Активные отклики" value={stats.active} hint="Applied, screening и interview" />
        <MetricCard label="Интервью" value={stats.interviews} hint="Вакансии на этапе собеседования" />
      </section>

      {loading && jobs.length === 0 && (
        <StateBox title="Загрузка вакансий" text="Приложение запрашивает данные из REST API." type="loading" />
      )}

      {error && (
        <StateBox
          title="Ошибка загрузки данных"
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
        <StateBox title="Вакансий пока нет" text="Создайте первую вакансию, чтобы заполнить обзор." />
      )}

      {latestJobs.length > 0 && (
        <section className="page">
          <div className="page-header">
            <div>
              <h2 className="panel__title">Последние вакансии</h2>
              <p className="page-header__text">Недавние позиции из Redux store с быстрым изменением статуса.</p>
            </div>
            <Link className="button button--secondary" to="/jobs">
              Смотреть все
            </Link>
          </div>
          <div className="job-grid">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default DashboardPage;
