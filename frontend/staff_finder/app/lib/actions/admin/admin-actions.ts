"use server";

import {
  getAllUsers,
  getUserById,
  getUsersByRole,
  updateUser,
  changeUserPassword,
  deleteUser,
  createUser,
  UpdateUserPayload,
  ChangePasswordPayload,
  CreateUserPayload,
} from "@/app/lib/api/admin/admin";

function normalizeUser(u: any) {
  return {
    ...u,
    id:       u._id ?? u.id,
    name:     `${u.firstname ?? ""} ${u.lastname ?? ""}`.trim() || u.username,
    imageUrl: u.imageUrl ?? u.image ?? "", // ✅
  };
}

function extractUsers(data: any) {
  if (Array.isArray(data))          return data.map(normalizeUser);
  if (Array.isArray(data?.data))    return data.data.map(normalizeUser);
  if (Array.isArray(data?.users))   return data.users.map(normalizeUser);
  return [];
}

function extractUser(data: any) {
  const u = data?.data ?? data?.user ?? data;
  return normalizeUser(u);
}

export async function getAllUsersAction() {
  try {
    const raw   = await getAllUsers();
    const users = extractUsers(raw);
    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to fetch users" };
  }
}

export async function getUserByIdAction(id: string) {
  try {
    const raw  = await getUserById(id);
    const user = extractUser(raw);
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to fetch user" };
  }
}

export async function createUserAction(data: CreateUserPayload) {
  try {
    const raw  = await createUser(data);
    const user = extractUser(raw);
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to create user" };
  }
}

export async function getUsersByRoleAction(role: "admin" | "user") {
  try {
    const raw   = await getUsersByRole(role);
    const users = extractUsers(raw);
    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to fetch users by role" };
  }
}

export async function updateUserAction(id: string, payload: UpdateUserPayload) {
  try {
    const raw  = await updateUser(id, payload);
    const user = extractUser(raw);
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to update user" };
  }
}

export async function changeUserPasswordAction(id: string, payload: ChangePasswordPayload) {
  try {
    const result = await changeUserPassword(id, payload);
    return { success: true, message: result.message };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to change password" };
  }
}

export async function deleteUserAction(id: string) {
  try {
    const result = await deleteUser(id);
    return { success: true, message: result.message };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to delete user" };
  }
}