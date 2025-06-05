// src/api/cuentas.ts
import { makeApi } from "../lib/http";
const cuentasApi = makeApi("/api/cuentas");

export const getCuentas               = ()            => cuentasApi.get("");
export const createCuenta             = (d)           => cuentasApi.post("", d);
export const updateCuenta             = (id, d)       => cuentasApi.put(`/${id}`, d);
export const deleteCuenta             = (id)          => cuentasApi.delete(`/${id}`);
export const getTransaccionesByCuenta = (id)          => cuentasApi.get(`/${id}/transacciones`);
