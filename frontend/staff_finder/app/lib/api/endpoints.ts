const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/users`,          // POST /users
    LOGIN:    `${BASE_URL}/users/login`,    // POST /users/login
  },

  USERS: {
    GET_ALL:         `${BASE_URL}/users`,
    GET_BY_ID:       (id: string) => `${BASE_URL}/users/${id}`,
    GET_BY_ROLE:     (role: "admin" | "user") => `${BASE_URL}/users/role/${role}`,
    UPDATE:          (id: string) => `${BASE_URL}/users/${id}`,
    CHANGE_PASSWORD: (id: string) => `${BASE_URL}/users/${id}/change-password`,
    DELETE:          (id: string) => `${BASE_URL}/users/${id}`,
  },
} as const;