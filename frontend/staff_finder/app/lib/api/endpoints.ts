import { Beaker } from "lucide-react";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
  },
  UPLOAD:`${BASE_URL}/upload`,
  ADMIN: {
    USERS: {
      GET_ALL: `${BASE_URL}/admin/users`,
      GET_BY_ID: (id: string) => `${BASE_URL}/admin/users/${id}`,
      GET_BY_ROLE: (role: "admin" | "user") => `${BASE_URL}/admin/users/role/${role}`,
      UPDATE_ROLE: (id: string) => `${BASE_URL}/admin/users/${id}/role`,
      UPDATE: (id: string) => `${BASE_URL}/admin/users/${id}`,
      CHANGE_PASSWORD: (id: string) => `${BASE_URL}/admin/users/${id}/change-password`,
      DELETE: (id: string) => `${BASE_URL}/admin/users/${id}`,
    },
  },
  VACANCY: {
    GET_ALL: `${BASE_URL}/vacancy`,
    GET_BY_ID: (id: string) => `${BASE_URL}/vacancy/${id}`, // ✅ function
    CREATE: `${BASE_URL}/vacancy`,
    UPDATE: (id: string) => `${BASE_URL}/vacancy/${id}`,    // ✅ function
    DELETE: (id: string) => `${BASE_URL}/vacancy/${id}`,    // ✅ function
  },
} as const;