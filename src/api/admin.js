import { makeApi } from "../lib/http";
const adminApi = makeApi("/api");

export const getCuentas        = () => adminApi.get("/cuentas");
export const getTransacciones  = () => adminApi.get("/admin/transacciones");
export const getCompras        = () => adminApi.get("/admin/compras");
