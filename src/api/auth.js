import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8081/auth',
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  
  if (token && !config.url.endsWith('/login') && !config.url.endsWith('/register')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export const login = (credentials) => API.post('/login', credentials);
export const register = (data) => API.post('/register', data);
