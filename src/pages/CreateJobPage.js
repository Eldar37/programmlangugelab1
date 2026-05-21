import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import PageHeader from '../components/PageHeader';
import StateBox from '../components/StateBox';
import { useInitialData } from '../hooks/useInitialData';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { createJob, selectJobsSubmitting } from '../redux/slices/jobsSlice';
import {
  selectCompanies,
  selectCompaniesError,
  selectCompaniesLoading,
} from '../redux/slices/companiesSlice';

function CreateJobPage() {
  useInitialData();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const companies = useAppSelector(selectCompanies);
  const companiesLoading = useAppSelector(selectCompaniesLoading);
  const companiesError = useAppSelector(selectCompaniesError);
  const submitting = useAppSelector(selectJobsSubmitting);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (values) => {
    setFormError('');

    try {
      await dispatch(createJob(values)).unwrap();
      navigate('/jobs');
    } catch (error) {
      setFormError(String(error));
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Добавление"
        title="Новая вакансия"
        text="Добавьте вакансию, укажите компанию, стек, формат работы, статус отклика и отметьте ее как сохраненную при необходимости."
      />

      {companiesLoading && companies.length === 0 && (
        <StateBox title="Загрузка компаний" text="Компании загружаются перед открытием формы." type="loading" />
      )}

      {companiesError && <StateBox title="Ошибка компаний" text={companiesError} type="error" />}
      {formError && <StateBox title="Ошибка создания" text={formError} type="error" />}

      {companies.length > 0 && (
        <JobForm
          companies={companies}
          submitLabel="Создать вакансию"
          isSubmitting={submitting}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default CreateJobPage;
