const DATA_URL = '/mock/home-content.json';
const MOCK_DELAY_MS = 1500;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchHomeContent() {
  await delay(MOCK_DELAY_MS);

  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error('Failed to load content');
  }

  return response.json();
}
