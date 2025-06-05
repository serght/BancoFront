import { makeApi } from "../lib/http";
const authApi = makeApi("/auth");

export const login    = (credentials) => authApi.post("/login", credentials);
export const register = (data)        => authApi.post("/register", data);
