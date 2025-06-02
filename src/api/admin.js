// src/api/admin.js

import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081",
});

adminApi.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (
    token &&
    !cfg.url.startsWith("/auth/login") &&
    !cfg.url.startsWith("/auth/register")
  ) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// GET http://localhost:8081/api/cuentas
export const getCuentas = () => adminApi.get("/api/cuentas");

// GET http://localhost:8081/api/admin/transacciones
export const getTransacciones = () => adminApi.get("/api/admin/transacciones");

// (Opcional) GET http://localhost:8081/api/admin/compras
export const getCompras = () => adminApi.get("/api/admin/compras");
