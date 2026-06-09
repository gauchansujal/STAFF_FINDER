"use server";

import { cookies } from "next/headers";
import { apiLogin, apiRegister } from "../api/auth";
import type { LoginDTOType, RegisterDTOType } from "@/app/auth/auth.schema";

const TOKEN_KEY = "token";

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

export async function registerAction(
  payload: RegisterDTOType
): Promise<{ success: boolean; message: string }> {
  try {
    const result = await apiRegister(payload);
    return { success: result.success, message: result.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function loginAction(
  payload: LoginDTOType
): Promise<{ success: boolean; message: string; user?: UserResponseDTO }> {
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL); // 👈 ADD
  console.log("PAYLOAD:", payload);                          // 👈 ADD
  try {
    const result = await apiLogin(payload);

    console.log("LOGIN RESPONSE:", JSON.stringify(result, null, 2));

    const token = result.token ?? (result.data as any)?.token;

    if (!token) {
      return { success: false, message: "No token returned from server." };
    }

    const cookieStore = await cookies();
    cookieStore.set(TOKEN_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, message: result.message, user: result.data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
}