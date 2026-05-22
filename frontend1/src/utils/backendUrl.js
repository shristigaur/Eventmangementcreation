const LOCAL_API_URL = 'http://localhost:5000';
const PRODUCTION_API_URL = 'https://eventmangementcreation.onrender.com';

const normalizeBackendUrl = (url) => {
  const trimmedUrl = (url || '').trim().replace(/\/+$/, '');

  if (!trimmedUrl) {
    throw new Error('API base URL is missing. Set VITE_API_URL or VITE_BACKEND_URL.');
  }

  return trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;
};

const resolveDefaultApiUrl = () => (import.meta.env.DEV ? LOCAL_API_URL : PRODUCTION_API_URL);

export const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || resolveDefaultApiUrl();
  return normalizeBackendUrl(apiUrl);
};

export const getHealthUrl = () => {
  const backendUrl = (
    import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || resolveDefaultApiUrl()
  )
    .trim()
    .replace(/\/+$/, '');

  return backendUrl.endsWith('/api') ? `${backendUrl.slice(0, -4)}/health` : `${backendUrl}/health`;
};
