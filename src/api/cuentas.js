<<<<<<< HEAD
import api from './api';

/*  GET http://localhost:8081/api/cuentas  */
export const getCuentas = () => api.get('/api/admin/cuentas');
=======
import axios from 'axios';


const API = axios.create({
  baseURL: 'http://localhost:8080/api/cuentas',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCuentas = () => API.get('');
export const createCuenta = (data) => API.post('', data);
export const updateCuenta = (id, data) => API.put(`/${id}`, data);
export const deleteCuenta = (id) => API.delete(`/${id}`);
>>>>>>> 61d9f9873859453059373c1280327fc3875e24e8
