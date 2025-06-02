import api from './api';

/*  GET http://localhost:8081/api/admin/transacciones  */
export const getTransacciones = () => api.get('/api/admin/transacciones');
