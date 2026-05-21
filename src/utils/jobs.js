export const APPLICATION_STATUSES = [
  { value: 'wishlist', label: 'В планах', tone: 'neutral' },
  { value: 'applied', label: 'Отклик отправлен', tone: 'blue' },
  { value: 'screening', label: 'Скрининг', tone: 'teal' },
  { value: 'interview', label: 'Интервью', tone: 'orange' },
  { value: 'offer', label: 'Оффер', tone: 'green' },
  { value: 'rejected', label: 'Отказ', tone: 'red' },
];

export const WORK_FORMATS = [
  { value: 'remote', label: 'Удаленно' },
  { value: 'hybrid', label: 'Гибрид' },
  { value: 'office', label: 'Офис' },
];

export const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Полная занятость' },
  { value: 'contract', label: 'Контракт' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'internship', label: 'Стажировка' },
];

const jobTitles = [
  'Frontend React Developer',
  'Backend Node.js Engineer',
  'Fullstack JavaScript Developer',
  'Python Backend Developer',
  'DevOps Engineer',
  'QA Automation Engineer',
  'Mobile React Native Developer',
  'Data Engineer',
  'UI Developer',
  'Junior Frontend Developer',
];

const stacks = [
  'React, Redux Toolkit, TypeScript',
  'Node.js, Express, PostgreSQL',
  'React, Node.js, REST API',
  'Python, FastAPI, Docker',
  'Kubernetes, CI/CD, AWS',
  'Playwright, Jest, TypeScript',
  'React Native, Expo, Firebase',
  'Python, SQL, Airflow',
  'HTML, CSS, JavaScript',
  'JavaScript, Git, REST API',
];

const locations = [
  'Алматы',
  'Астана',
  'Караганда',
  'Удаленно',
  'Шымкент',
  'Актобе',
  'Костанай',
  'Павлодар',
  'Тараз',
  'Кокшетау',
];

const salaries = [
  'от 350 000 ₸',
  '450 000 - 700 000 ₸',
  'от 800 000 ₸',
  'по результатам интервью',
  'от 500 000 ₸',
  '600 000 - 900 000 ₸',
  'от 300 000 ₸',
  '700 000 - 1 100 000 ₸',
  'от 400 000 ₸',
  '250 000 - 450 000 ₸',
];

function pick(items, seed) {
  return items[Math.abs(seed) % items.length];
}

export function createClientId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isRemoteJobId(id) {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId >= 1 && numericId <= 100;
}

export function getOptionLabel(options, value) {
  return options.find((item) => item.value === value)?.label || value;
}

export function getStatusOption(value) {
  return APPLICATION_STATUSES.find((item) => item.value === value) || APPLICATION_STATUSES[0];
}

export function normalizeNote(note) {
  return {
    id: note.id || createClientId(),
    text: String(note.text || '').trim(),
    createdAt: note.createdAt || new Date().toISOString(),
    updatedAt: note.updatedAt || null,
  };
}

function createSeedNote(seed) {
  if (seed % 6 !== 0) {
    return [];
  }

  return [
    normalizeNote({
      id: `note-${seed}`,
      text: 'Проверить стек, вилку зарплаты и сроки обратной связи рекрутера.',
      createdAt: '2026-05-01T08:00:00.000Z',
    }),
  ];
}

export function normalizeJob(job) {
  const id = job.id || createClientId();
  const numericSeed = Number(id) || String(id).length;
  const isApiShape = Boolean(job.body) && !job.description && !job.stack;
  const title = isApiShape ? pick(jobTitles, numericSeed) : String(job.title || pick(jobTitles, numericSeed)).trim();
  const stack = String(job.stack || pick(stacks, numericSeed)).trim();
  const body = String(job.description || job.body || '').trim();
  const description =
    body && !isApiShape
      ? body
      : `Вакансия для разработчика в продуктовой команде: код-ревью, разработка интерфейсов и интеграция с API. Исходное описание: ${body || title}.`;

  return {
    id,
    companyId: Number(job.companyId ?? job.userId) || ((numericSeed % 10) + 1),
    title,
    stack,
    description,
    location: String(job.location || pick(locations, numericSeed)).trim(),
    workFormat: job.workFormat || pick(WORK_FORMATS, numericSeed).value,
    employmentType: job.employmentType || pick(EMPLOYMENT_TYPES, numericSeed).value,
    salary: String(job.salary || pick(salaries, numericSeed)).trim(),
    status: job.status || pick(APPLICATION_STATUSES, numericSeed).value,
    saved: Boolean(job.saved ?? numericSeed % 5 === 0),
    notes: Array.isArray(job.notes) ? job.notes.map(normalizeNote) : createSeedNote(numericSeed),
    createdAt: job.createdAt || null,
    updatedAt: job.updatedAt || null,
    isLocal: Boolean(job.isLocal),
  };
}

export function getJobExcerpt(description, maxLength = 170) {
  if (!description || description.length <= maxLength) {
    return description;
  }

  return `${description.slice(0, maxLength).trim()}...`;
}

export function getCompanyName(companies, companyId) {
  const company = companies.find((item) => Number(item.id) === Number(companyId));
  return company ? company.name : `Компания #${companyId}`;
}

export function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
