import { publicAxios, withToken } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { cookies } from "next/headers";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return token ?? "";
}

export interface User {
 _id:       string;
  id:        string; // mapped from _id
  username:  string;
  email:     string;
  firstname?: string;
  lastname?:  string;
  image?:     string;
  role:       "admin" | "user";
  createdAt:  string;
  updatedAt:  string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
  image?: { uri: string; name: string; type: string };
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  image?: { uri: string; name: string; type: string };
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// POST /auth/register — public
export const createUser = async (payload: CreateUserPayload): Promise<any> => {
  const formData = new FormData();
  formData.append("email",    payload.email);
  formData.append("password", payload.password);
  formData.append("username", payload.username);
  if (payload.firstName) formData.append("firstName", payload.firstName);
  if (payload.lastName)  formData.append("lastName",  payload.lastName);
  if (payload.image) {
    formData.append("image", {
      uri:  payload.image.uri,
      name: payload.image.name,
      type: payload.image.type,
    } as any);
  }
  const response = await publicAxios.post(ENDPOINTS.AUTH.REGISTER, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// GET /users
export const getAllUsers = async (): Promise<any> => {
  const token    = await getToken();
  const response = await withToken(token).get(ENDPOINTS.ADMIN.USERS.GET_ALL);
  return response.data;
};

// GET /users/:id
export const getUserById = async (id: string): Promise<any> => {
  const token    = await getToken();
  const response = await withToken(token).get(ENDPOINTS.ADMIN.USERS.GET_BY_ID(id));
  return response.data;
};

// GET /users/role/:role
export const getUsersByRole = async (role: "admin" | "user"): Promise<any> => {
  const token    = await getToken();
  const response = await withToken(token).get(ENDPOINTS.ADMIN.USERS.GET_BY_ROLE(role));
  return response.data;
};

// PUT /users/:id
export const updateUser = async (id: string, payload: UpdateUserPayload): Promise<any> => {
  const token = await getToken();
  const http  = withToken(token);

  if (payload.image) {
    const formData = new FormData();
    if (payload.name)      formData.append("name",      payload.name);
    if (payload.email)     formData.append("email",     payload.email);
    if (payload.username)  formData.append("username",  payload.username);
    if (payload.firstName) formData.append("firstName", payload.firstName);
    if (payload.lastName)  formData.append("lastName",  payload.lastName);
    formData.append("image", {
      uri:  payload.image.uri,
      name: payload.image.name,
      type: payload.image.type,
    } as any);
    const response = await http.put(ENDPOINTS.ADMIN.USERS.UPDATE(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  const response = await http.put(ENDPOINTS.ADMIN.USERS.UPDATE(id), payload);
  return response.data;
};

// PATCH /users/:id/change-password
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

// DELETE /users/:id
export const deleteUser = async (id: string): Promise<any> => {
  const token    = await getToken();
  const response = await withToken(token).delete(ENDPOINTS.ADMIN.USERS.DELETE(id));
  return response.data;
};