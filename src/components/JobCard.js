import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import {
  deleteJob,
  selectJobDeletingIds,
  setJobStatus,
  toggleJobSaved,
} from '../redux/slices/jobsSlice';
import { selectCompanies } from '../redux/slices/companiesSlice';
import {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  WORK_FORMATS,
  getCompanyName,
  getJobExcerpt,
  getOptionLabel,
  getStatusOption,
} from '../utils/jobs';

function JobCard({ job }) {
  const dispatch = useAppDispatch();
  const companies = useAppSelector(selectCompanies);
  const deletingIds = useAppSelector(selectJobDeletingIds);
  const isDeleting = deletingIds.includes(String(job.id));
  const status = getStatusOption(job.status);

  return (
    <article className="job-card">
      <div className="job-card__topline">
        <div className="job-card__meta">
          <span>{getCompanyName(companies, job.companyId)}</span>
          <span>{job.location}</span>
          <span>{getOptionLabel(WORK_FORMATS, job.workFormat)}</span>
        </div>
        <span className={`badge badge--${status.tone}`}>{status.label}</span>
      </div>

      <div>
        <h2 className="job-card__title">{job.title}</h2>
        <p className="job-card__stack">{job.stack}</p>
      </div>

      <p className="job-card__body">{getJobExcerpt(job.description)}</p>

      <div className="job-card__details">
        <span>{getOptionLabel(EMPLOYMENT_TYPES, job.employmentType)}</span>
        <span>{job.salary || 'Зарплата не указана'}</span>
        <span>{job.notes.length} заметок</span>
        {job.saved && <span className="badge badge--saved">Сохранена</span>}
        {job.isLocal && <span className="badge badge--local">Локально</span>}
      </div>

      <label className="status-control">
        <span className="label">Статус отклика</span>
        <select
          className="select"
          value={job.status}
          onChange={(event) => dispatch(setJobStatus({ id: job.id, status: event.target.value }))}
        >
          {APPLICATION_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <div className="button-row">
        <button
          type="button"
          className={job.saved ? 'button button--accent' : 'button button--secondary'}
          onClick={() => dispatch(toggleJobSaved(job.id))}
        >
          {job.saved ? 'Убрать из сохраненных' : 'Сохранить'}
        </button>
        <Link className="button button--secondary" to={`/jobs/${job.id}/edit`}>
          Редактировать
        </Link>
        <button
          type="button"
          className="button button--danger"
          disabled={isDeleting}
          onClick={() => dispatch(deleteJob(job.id))}
        >
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </button>
      </div>
    </article>
  );
}

export default JobCard;
