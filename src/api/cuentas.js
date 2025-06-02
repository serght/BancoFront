import api from './api';

/*  GET http://localhost:8081/api/cuentas  */
export const getCuentas = () => api.get('/api/admin/cuentas');
