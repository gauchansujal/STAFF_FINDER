"use server";

import {
  getAllVacancies,
  getVacancyById,
  createVacancy,
  updateVacancy,
  deleteVacancy,
  CreateVacancyPayload,
  UpdateVacancyPayload,
  Vacancy,
} from "../api/vacancy";

function normalizeVacancy(v: any): Vacancy {
  return {
    ...v,
    id: v._id ?? v.id,
  };
}

export async function getAllVacanciesAction(page?: number, size?: number, search?: string) {
  try {
    const raw = await getAllVacancies(page, size, search);
    return {
      success: true,
      data: raw.Vacancy.map(normalizeVacancy),
      pagination: raw.pagination,
    };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to fetch vacancies" };
  }
}

export async function getVacancyByIdAction(id: string) {
  try {
    const raw = await getVacancyById(id);
    return { success: true, data: normalizeVacancy(raw) };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to fetch vacancy" };
  }
}

export async function createVacancyAction(payload: CreateVacancyPayload) {
  try {
    const raw = await createVacancy(payload);
    return { success: true, data: normalizeVacancy(raw) };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to create vacancy" };
  }
}

export async function updateVacancyAction(id: string, payload: UpdateVacancyPayload) {
  try {
    const raw = await updateVacancy(id, payload);
    return { success: true, data: normalizeVacancy(raw) };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to update vacancy" };
  }
}

export async function deleteVacancyAction(id: string) {
  try {
    await deleteVacancy(id);
    return { success: true, message: "Vacancy deleted successfully" };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to delete vacancy" };
  }
}