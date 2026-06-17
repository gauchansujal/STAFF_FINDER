import { publicAxios, withToken } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { cookies } from "next/headers";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ?? "";
}

export interface User {
  _id:        string;
  id:         string;
  username:   string;
  email:      string;
  firstname?: string;
  lastname?:  string;
  image?:     string;
  imageUrl?:  string; // ✅
  role:       "admin" | "user";
  createdAt:  string;
  updatedAt:  string;
}

export interface CreateUserPayload {
  email:      string;
  password:   string;
  username:   string;
  firstName?: string;
  lastName?:  string;
  imageUrl?:  string; // ✅ added
}

export interface UpdateUserPayload {
  email?:     string;
  username?:  string;
  firstName?: string;
  lastName?:  string;
  imageUrl?:  string; // ✅
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword:     string;
}

// POST /auth/register — create user
export const createUser = async (payload: CreateUserPayload): Promise<any> => {
  const body = {
    email:     payload.email,
    password:  payload.password,
    username:  payload.username,
    firstname: payload.firstName,
    lastname:  payload.lastName,
    ...(payload.imageUrl && { imageUrl: payload.imageUrl }), // ✅ added
  };
  console.log("CREATE USER BODY:", JSON.stringify(body, null, 2));
  const response = await publicAxios.post(ENDPOINTS.AUTH.REGISTER, body);
  return response.data;
};

// GET /admin/users
export const getAllUsers = async (): Promise<any> => {
  const token    = await getToken();
  const response = await withToken(token).get(ENDPOINTS.ADMIN.USERS.GET_ALL);
  return response.data;
};

// GET /admin/users/:id
export const getUserById = async (id: string): Promise<any> => {
  const token    = await getToken();
  const response = await withToken(token).get(ENDPOINTS.ADMIN.USERS.GET_BY_ID(id));
  return response.data;
};

// GET /admin/users/role/:role
export const getUsersByRole = async (role: "admin" | "user"): Promise<any> => {
  const token    = await getToken();
  const response = await withToken(token).get(ENDPOINTS.ADMIN.USERS.GET_BY_ROLE(role));
  return response.data;
};

// PATCH /admin/users/:id
export const updateUser = async (id: string, payload: UpdateUserPayload): Promise<any> => {
  const token = await getToken();
  const body  = {
    ...(payload.email     && { email:     payload.email }),
    ...(payload.username  && { username:  payload.username }),
    ...(payload.firstName && { firstname: payload.firstName }),
    ...(payload.lastName  && { lastname:  payload.lastName }),
    ...(payload.imageUrl  && { imageUrl:  payload.imageUrl }), // ✅
  };
  console.log("UPDATE USER BODY:", JSON.stringify(body, null, 2));
  const response = await withToken(token).patch(ENDPOINTS.ADMIN.USERS.UPDATE(id), body);
  return response.data;
};

// PATCH /admin/users/:id/change-password
export const changeUserPassword = async (
  id: string,
  payload: ChangePasswordPayload
): Promise<any> => {
  const token    = await getToken();
  const response = await withToken(token).patch(
    ENDPOINTS.ADMIN.USERS.CHANGE_PASSWORD(id),
    payload
  );
  return response.data;
};

// DELETE /admin/users/:id
export const deleteUser = async (id: string): Promise<any> => {
  const token    = await getToken();
  const response = await withToken(token).delete(ENDPOINTS.ADMIN.USERS.DELETE(id));
  return response.data;
};