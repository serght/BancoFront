import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://10.43.103.210:8081";

export function makeApi(basePath) {
  const api = axios.create({ baseURL: `${BASE_URL}${basePath}` });

  api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("token");
    // Evita añadir token en login/register
    const isAuthEndpoint =
      cfg.url?.endsWith("/login") || cfg.url?.endsWith("/register");

    if (token && !isAuthEndpoint) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  });

  return api;
}
