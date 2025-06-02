import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
});

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t && !cfg.url.startsWith('/auth')) {
    cfg.headers.Authorization = `Bearer ${t}`;
  }
  return cfg;
});

export default api;
