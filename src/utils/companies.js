const focusAreas = [
  'FinTech',
  'E-commerce',
  'EdTech',
  'SaaS',
  'Enterprise',
  'Mobile products',
  'Cloud platforms',
  'Data products',
  'Internal tools',
  'Cybersecurity',
];

function pick(items, seed) {
  return items[Math.abs(seed) % items.length];
}

export function normalizeCompany(company) {
  const id = Number(company.id) || 1;

  return {
    id,
    name: company.company?.name || company.name || `IT Company #${id}`,
    recruiter: company.name || `Recruiter #${id}`,
    email: company.email || `hr${id}@example.com`,
    website: company.website ? `https://${company.website}` : '',
    city: company.address?.city || 'Алматы',
    focus: pick(focusAreas, id),
  };
}
