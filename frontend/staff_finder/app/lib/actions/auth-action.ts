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

function decodeJwt(token: string): { role?: string } {
  try {
    const base64  = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
    return decoded;
  } catch {
    return {};
  }
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
): Promise<{ success: boolean; message: string; user?: { role: string } }> {
  try {
    const result = await apiLogin(payload);
    console.log("LOGIN RESPONSE:", JSON.stringify(result, null, 2));

    const token = result.token ?? (result.data as any)?.token;

    if (!token) {
      return { success: false, message: "No token returned from server." };
    }

    // decode role from JWT — backend only puts id+role in token
    const decoded = decodeJwt(token);
    const role    = decoded?.role ?? result.data?.role;

    console.log("DECODED ROLE:", role);

    // set cookie
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_KEY, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      path:     "/",
      maxAge:   60 * 60 * 24 * 7,
    });

    return {
      success: true,
      message: result.message ?? "Login successful",
      user:    { role: role ?? "user" },
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
}