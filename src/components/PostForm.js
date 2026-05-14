import { useEffect, useMemo, useState } from 'react';

const defaultValues = {
  title: '',
  body: '',
  userId: 1,
};

function validate(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required.';
  }

  if (values.title.trim().length > 120) {
    errors.title = 'Title must be 120 characters or shorter.';
  }

  if (!values.body.trim()) {
    errors.body = 'Text is required.';
  }

  if (!Number(values.userId)) {
    errors.userId = 'Choose an author.';
  }

  return errors;
}

function PostForm({ initialValues, users, submitLabel, isSubmitting, onSubmit }) {
  const preparedValues = useMemo(
    () => ({
      ...defaultValues,
      ...initialValues,
      userId: Number(initialValues?.userId || defaultValues.userId),
    }),
    [initialValues]
  );
  const [values, setValues] = useState(preparedValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(preparedValues);
    setErrors({});
  }, [preparedValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: name === 'userId' ? Number(value) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onSubmit({
        title: values.title.trim(),
        body: values.body.trim(),
        userId: Number(values.userId),
      });
    }
  };

  return (
    <form className="form panel" onSubmit={handleSubmit}>
      <label className="form__field">
        <span className="label">Author</span>
        <select
          className="select"
          name="userId"
          value={values.userId}
          onChange={handleChange}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {errors.userId && <p className="form__error">{errors.userId}</p>}
      </label>

      <label className="form__field">
        <span className="label">Title</span>
        <input
          className="input"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Post title"
        />
        {errors.title && <p className="form__error">{errors.title}</p>}
      </label>

      <label className="form__field">
        <span className="label">Text</span>
        <textarea
          className="textarea"
          name="body"
          value={values.body}
          onChange={handleChange}
          placeholder="Post text"
        />
        {errors.body && <p className="form__error">{errors.body}</p>}
      </label>

      <div className="button-row">
        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default PostForm;
