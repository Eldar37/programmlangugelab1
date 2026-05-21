import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import JobForm from '../components/JobForm';
import NotesManager from '../components/NotesManager';
import PageHeader from '../components/PageHeader';
import StateBox from '../components/StateBox';
import { useInitialData } from '../hooks/useInitialData';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import {
  selectJobById,
  selectJobsLoading,
  selectJobsSubmitting,
  updateJob,
} from '../redux/slices/jobsSlice';
import { selectCompanies } from '../redux/slices/companiesSlice';

function EditJobPage() {
  useInitialData();
  const { jobId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const job = useAppSelector((state) => selectJobById(state, jobId));
  const companies = useAppSelector(selectCompanies);
  const loading = useAppSelector(selectJobsLoading);
  const submitting = useAppSelector(selectJobsSubmitting);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (values) => {
    setFormError('');

    try {
      await dispatch(updateJob({ id: job.id, changes: values })).unwrap();
      navigate('/jobs');
    } catch (error) {
      setFormError(String(error));
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Редактирование"
        title="Карточка вакансии"
        text="Изменяйте данные вакансии, статус отклика и ведите заметки по процессу отбора."
        action={
          <Link className="button button--secondary" to="/jobs">
            Назад к вакансиям
          </Link>
        }
      />

      {loading && !job && <StateBox title="Загрузка вакансии" text="Ожидаем данные из API." type="loading" />}

      {!loading && !job && (
        <StateBox title="Вакансия не найдена" text="Запрошенной вакансии нет в текущем Redux state." />
      )}

      {formError && <StateBox title="Ошибка обновления" text={formError} type="error" />}

      {job && companies.length > 0 && (
        <>
          <JobForm
            initialValues={job}
            companies={companies}
            submitLabel="Сохранить изменения"
            isSubmitting={submitting}
            onSubmit={handleSubmit}
          />
          <NotesManager job={job} />
        </>
      )}
    </div>
  );
}

export default EditJobPage;
