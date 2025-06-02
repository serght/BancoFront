import axios from 'axios';

/* BaseURL apunta a la raíz de tu backend, NO a /api/admin */
const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
});

/* Inyecta token automáticamente en cada request (excepto /auth/login y /auth/register) */
adminApi.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token');
  if (
    t &&
    !cfg.url.startsWith('/auth/login') &&
    !cfg.url.startsWith('/auth/register')
  ) {
    cfg.headers.Authorization = `Bearer ${t}`;
  }
  return cfg;
});

/* ─── ENDPOINTS ─────────────────────────── */
// GET http://localhost:8081/api/cuentas
export const getCuentas = () => adminApi.get('/api/admin/cuentas');

// GET http://localhost:8081/api/admin/transacciones
export const getTransacciones = () =>
  adminApi.get('/api/admin/transacciones');

// (Opcional) GET http://localhost:8081/api/admin/compras
export const getCompras = () => adminApi.get('/api/admin/compras');
