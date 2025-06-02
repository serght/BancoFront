import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:8081/api",
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


export const getCuentas = () => adminApi.get("cuentas");
export const getTransacciones = () => adminApi.get("/admin/transacciones");
export const getCompras = () => adminApi.get("/admin/compras");
