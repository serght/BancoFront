import axios from 'axios';

/* instancia para todo lo que viene de /api/admin */
const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api/admin',
});

/* inyecta el token en cada request */
adminApi.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

/* ─── ENDPOINTS ───────────────────────────── */
export const getCuentas       = () => adminApi.get('/cuentas');        // lista cuentas
export const getTransacciones = () => adminApi.get('/transacciones');  // lista transacciones
export const getCompras       = () => adminApi.get('/compras');        // si también necesitas compras
