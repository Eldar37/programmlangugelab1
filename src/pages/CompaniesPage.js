import PageHeader from '../components/PageHeader';
import StateBox from '../components/StateBox';
import { useInitialData } from '../hooks/useInitialData';
import { useAppSelector } from '../hooks/useRedux';
import { selectCompanies, selectCompaniesError, selectCompaniesLoading } from '../redux/slices/companiesSlice';
import { selectJobs } from '../redux/slices/jobsSlice';

function CompaniesPage() {
  useInitialData();
  const companies = useAppSelector(selectCompanies);
  const jobs = useAppSelector(selectJobs);
  const loading = useAppSelector(selectCompaniesLoading);
  const error = useAppSelector(selectCompaniesError);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Компании"
        title="Работодатели и рекрутеры"
        text="Компании связаны с вакансиями через Redux state, поэтому можно видеть, где больше открытых позиций."
      />

      {loading && companies.length === 0 && (
        <StateBox title="Загрузка компаний" text="Получаем компании из REST API." type="loading" />
      )}

      {error && <StateBox title="Ошибка компаний" text={error} type="error" />}

      {!loading && !error && companies.length === 0 && (
        <StateBox title="Компаний нет" text="API вернул пустой список компаний." />
      )}

      {companies.length > 0 && (
        <section className="company-grid">
          {companies.map((company) => {
            const count = jobs.filter((job) => Number(job.companyId) === Number(company.id)).length;

            return (
              <article className="company-card" key={company.id}>
                <p className="company-card__focus">{company.focus}</p>
                <h2 className="company-card__name">{company.name}</h2>
                <p className="company-card__line">{company.city}</p>
                <p className="company-card__line">Рекрутер: {company.recruiter}</p>
                <p className="company-card__line">{company.email}</p>
                <p className="company-card__line">
                  <strong>{count}</strong> вакансий в трекере
                </p>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default CompaniesPage;
