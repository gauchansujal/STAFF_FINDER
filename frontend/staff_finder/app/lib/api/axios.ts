import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ── Public instance (no auth header) ─────────────────────────────────────────
export const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

publicAxios.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? "Unknown error";
    return Promise.reject(new Error(message));
  }
);

// ── Private instance (attaches JWT from cookie) ───────────────────────────────
// NOTE: token is read server-side via next/headers cookies(), not js-cookie
export const privateAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

privateAxios.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? "Unknown error";
    return Promise.reject(new Error(message));
  }
);