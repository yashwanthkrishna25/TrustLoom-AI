export const API_BASE = (
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
    ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/+$/, '')
    : (typeof window !== 'undefined' && (window.location.hostname.endsWith('vercel.app') || window.location.hostname === 'trust-loom-ai.vercel.app')
        ? 'https://trustloom-ai-1.onrender.com'
        : '')
) + '/api';

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  return API_BASE + cleanEndpoint;
};

export default API_BASE;

