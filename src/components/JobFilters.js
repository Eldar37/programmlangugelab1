import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import {
  resetFilters,
  selectJobsFilters,
  setCompanyFilter,
  setSavedFilter,
  setSearchFilter,
  setStatusFilter,
  setWorkFormatFilter,
} from '../redux/slices/jobsSlice';
import { selectCompanies } from '../redux/slices/companiesSlice';
import { APPLICATION_STATUSES, WORK_FORMATS } from '../utils/jobs';

function JobFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectJobsFilters);
  const companies = useAppSelector(selectCompanies);

  return (
    <section className="toolbar" aria-label="Фильтры вакансий">
      <label className="toolbar__field toolbar__field--wide">
        <span className="label">Поиск</span>
        <input
          className="input"
          value={filters.search}
          onChange={(event) => dispatch(setSearchFilter(event.target.value))}
          placeholder="Название, стек, описание или город"
        />
      </label>

      <label className="toolbar__field">
        <span className="label">Компания</span>
        <select
          className="select"
          value={filters.companyId}
          onChange={(event) => dispatch(setCompanyFilter(event.target.value))}
        >
          <option value="all">Все компании</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </label>

      <label className="toolbar__field">
        <span className="label">Статус</span>
        <select
          className="select"
          value={filters.status}
          onChange={(event) => dispatch(setStatusFilter(event.target.value))}
        >
          <option value="all">Все статусы</option>
          {APPLICATION_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>

      <label className="toolbar__field">
        <span className="label">Формат</span>
        <select
          className="select"
          value={filters.workFormat}
          onChange={(event) => dispatch(setWorkFormatFilter(event.target.value))}
        >
          <option value="all">Любой</option>
          {WORK_FORMATS.map((format) => (
            <option key={format.value} value={format.value}>
              {format.label}
            </option>
          ))}
        </select>
      </label>

      <label className="checkbox-row toolbar__checkbox">
        <input
          type="checkbox"
          checked={filters.savedOnly}
          onChange={(event) => dispatch(setSavedFilter(event.target.checked))}
        />
        <span>Только сохраненные</span>
      </label>

      <button type="button" className="button button--secondary" onClick={() => dispatch(resetFilters())}>
        Сбросить
      </button>
    </section>
  );
}

export default JobFilters;
