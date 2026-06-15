const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,          // POST /auth/register
    LOGIN:    `${BASE_URL}/auth/login`,    // POST /auth/login\
  },
ADMIN:{
  USERS: {
    // CREATE: `${BASE_URL}/users`,
    GET_ALL:         `${BASE_URL}/admin/users`,
    GET_BY_ID:       (id: string) => `${BASE_URL}/admin/users/${id}`,
    GET_BY_ROLE:     (role: "admin" | "user") => `${BASE_URL}/admin/users/role/${role}`,
    UPDATE_ROLE:     (id: string) => `${BASE_URL}/admin/users/${id}/role`,
    UPDATE:     (id: string) => `${BASE_URL}/admin/users/${id}`,
    CHANGE_PASSWORD: (id: string) => `${BASE_URL}/admin/users/${id}/change-password`,
    DELETE:          (id: string) => `${BASE_URL}/admin/users/${id}`,
  },
},
} as const;