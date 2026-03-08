const apiBaseUrlFromEnv = String(process.env.REACT_APP_API_BASE_URL || '').trim();
const defaultApiBaseUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:4000/api';

const API_BASE_URL = (apiBaseUrlFromEnv || defaultApiBaseUrl).replace(/\/+$/, '');

export default API_BASE_URL;
