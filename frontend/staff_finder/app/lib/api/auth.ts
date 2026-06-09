import { publicAxios } from "./axios";
import { ENDPOINTS } from "./endpoints";
import type { LoginDTOType, RegisterDTOType } from "@/app/auth/auth.schema";

export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: "admin" | "user";
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  data?: UserResponseDTO;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: UserResponseDTO;
}

export async function apiRegister(payload: RegisterDTOType): Promise<RegisterResponse> {
  const { data } = await publicAxios.post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, payload);
  return data;
}

export async function apiLogin(payload: LoginDTOType): Promise<AuthResponse> {
  const { data } = await publicAxios.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, payload);
  return data;
}