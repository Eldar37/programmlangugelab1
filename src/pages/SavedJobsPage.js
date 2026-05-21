import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import PageHeader from '../components/PageHeader';
import StateBox from '../components/StateBox';
import { useInitialData } from '../hooks/useInitialData';
import { useAppSelector } from '../hooks/useRedux';
import { selectSavedJobs } from '../redux/slices/jobsSlice';

function SavedJobsPage() {
  useInitialData();
  const savedJobs = useAppSelector(selectSavedJobs);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Избранное"
        title="Сохраненные вакансии"
        text="Отдельный список вакансий, которые стоит изучить, сравнить или отправить позже."
        action={
          <Link className="button button--secondary" to="/jobs">
            Все вакансии
          </Link>
        }
      />

      {savedJobs.length === 0 && (
        <StateBox
          title="Сохраненных вакансий нет"
          text="Нажмите «Сохранить» на любой карточке вакансии, чтобы она появилась здесь."
        />
      )}

      {savedJobs.length > 0 && (
        <section className="job-grid">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </section>
      )}
    </div>
  );
}

export default SavedJobsPage;
