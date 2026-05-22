const normalizeBackendUrl = (url) => {
  const trimmedUrl = (url || '').trim().replace(/\/+$/, '');

  if (!trimmedUrl) {
    throw new Error('VITE_BACKEND_URL is missing. Set it in Vercel and local .env files.');
  }

  return trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;
};

export const getApiBaseUrl = () => {
  return normalizeBackendUrl(import.meta.env.VITE_BACKEND_URL);
};

export const getHealthUrl = () => {
  const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').trim().replace(/\/+$/, '');

  if (!backendUrl) {
    throw new Error('VITE_BACKEND_URL is missing. Set it in Vercel and local .env files.');
  }

  return backendUrl.endsWith('/api') ? `${backendUrl.slice(0, -4)}/health` : `${backendUrl}/health`;
};
