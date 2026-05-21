import { useEffect, useMemo, useState } from 'react';
import { APPLICATION_STATUSES, EMPLOYMENT_TYPES, WORK_FORMATS } from '../utils/jobs';

const defaultValues = {
  companyId: 1,
  title: '',
  stack: '',
  description: '',
  location: '',
  workFormat: 'remote',
  employmentType: 'full-time',
  salary: '',
  status: 'wishlist',
  saved: false,
};

function validate(values) {
  const errors = {};

  if (!Number(values.companyId)) {
    errors.companyId = 'Выберите компанию.';
  }

  if (!values.title.trim()) {
    errors.title = 'Введите название вакансии.';
  }

  if (values.title.trim().length > 120) {
    errors.title = 'Название должно быть не длиннее 120 символов.';
  }

  if (!values.stack.trim()) {
    errors.stack = 'Укажите ключевые технологии.';
  }

  if (!values.location.trim()) {
    errors.location = 'Укажите город или формат локации.';
  }

  if (!values.description.trim()) {
    errors.description = 'Добавьте описание вакансии.';
  }

  return errors;
}

function JobForm({ initialValues, companies, submitLabel, isSubmitting, onSubmit }) {
  const firstCompanyId = companies[0]?.id || defaultValues.companyId;
  const preparedValues = useMemo(() => {
    const baseValues = {
      ...defaultValues,
      ...initialValues,
    };

    return {
      ...baseValues,
      companyId: Number(baseValues.companyId || firstCompanyId),
      saved: Boolean(baseValues.saved),
    };
  }, [firstCompanyId, initialValues]);
  const [values, setValues] = useState(preparedValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(preparedValues);
    setErrors({});
  }, [preparedValues]);

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : name === 'companyId' ? Number(value) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onSubmit({
        companyId: Number(values.companyId),
        title: values.title.trim(),
        stack: values.stack.trim(),
        description: values.description.trim(),
        location: values.location.trim(),
        workFormat: values.workFormat,
        employmentType: values.employmentType,
        salary: values.salary.trim(),
        status: values.status,
        saved: values.saved,
      });
    }
  };

  return (
    <form className="form panel" onSubmit={handleSubmit}>
      <label className="form__field">
        <span className="label">Компания</span>
        <select className="select" name="companyId" value={values.companyId} onChange={handleChange}>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        {errors.companyId && <p className="form__error">{errors.companyId}</p>}
      </label>

      <label className="form__field">
        <span className="label">Название вакансии</span>
        <input
          className="input"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Frontend React Developer"
        />
        {errors.title && <p className="form__error">{errors.title}</p>}
      </label>

      <label className="form__field">
        <span className="label">Технологии</span>
        <input
          className="input"
          name="stack"
          value={values.stack}
          onChange={handleChange}
          placeholder="React, Redux Toolkit, TypeScript"
        />
        {errors.stack && <p className="form__error">{errors.stack}</p>}
      </label>

      <div className="form__grid">
        <label className="form__field">
          <span className="label">Локация</span>
          <input
            className="input"
            name="location"
            value={values.location}
            onChange={handleChange}
            placeholder="Алматы / удаленно"
          />
          {errors.location && <p className="form__error">{errors.location}</p>}
        </label>

        <label className="form__field">
          <span className="label">Зарплата</span>
          <input
            className="input"
            name="salary"
            value={values.salary}
            onChange={handleChange}
            placeholder="от 500 000 ₸"
          />
        </label>
      </div>

      <div className="form__grid">
        <label className="form__field">
          <span className="label">Формат</span>
          <select className="select" name="workFormat" value={values.workFormat} onChange={handleChange}>
            {WORK_FORMATS.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form__field">
          <span className="label">Тип занятости</span>
          <select
            className="select"
            name="employmentType"
            value={values.employmentType}
            onChange={handleChange}
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="form__field">
        <span className="label">Статус отклика</span>
        <select className="select" name="status" value={values.status} onChange={handleChange}>
          {APPLICATION_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>

      <label className="checkbox-row">
        <input type="checkbox" name="saved" checked={values.saved} onChange={handleChange} />
        <span>Сохранить вакансию в избранном</span>
      </label>

      <label className="form__field">
        <span className="label">Описание</span>
        <textarea
          className="textarea"
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Что делает команда, какие задачи, требования и этапы отбора."
        />
        {errors.description && <p className="form__error">{errors.description}</p>}
      </label>

      <div className="button-row">
        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default JobForm;
