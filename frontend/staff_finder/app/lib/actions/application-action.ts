"use server";

import {
  getAllApplications,
  getMyApplications,
  getApplicationById,
  applyForVacancy,
  getApplicationsByVacancy,
  updateApplicationStatus,
  deleteApplication,
  Application,
  ApplyPayload,
} from "../api/application";

function normalizeApplication(a: any): Application {
  return { ...a, id: a._id ?? a.id };
}

export async function getAllApplicationsAction() {
  try {
    const raw = await getAllApplications();
    return { success: true, data: raw.map(normalizeApplication) };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to fetch applications" };
  }
}

export async function getMyApplicationsAction() {
  try {
    const raw = await getMyApplications();
    return { success: true, data: raw.map(normalizeApplication) };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to fetch applications" };
  }
}

export async function getApplicationByIdAction(id: string) {
  try {
    const raw = await getApplicationById(id);
    return { success: true, data: normalizeApplication(raw) };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to fetch application" };
  }
}

export async function applyForVacancyAction(vacancyId: string, payload: ApplyPayload) {
  try {
    const raw = await applyForVacancy(vacancyId, payload);
    return { success: true, data: normalizeApplication(raw) };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to apply" };
  }
}

export async function getApplicationsByVacancyAction(vacancyId: string) {
  try {
    const raw = await getApplicationsByVacancy(vacancyId);
    return { success: true, data: raw.map(normalizeApplication) };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to fetch applications" };
  }
}

export async function updateApplicationStatusAction(
  id: string,
  status: "pending" | "accepted" | "rejected"
) {
  try {
    const raw = await updateApplicationStatus(id, status);
    return { success: true, data: normalizeApplication(raw) };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to update status" };
  }
}

export async function deleteApplicationAction(id: string) {
  try {
    await deleteApplication(id);
    return { success: true, message: "Application deleted" };
  } catch (error: any) {
    return { success: false, message: error?.message ?? "Failed to delete application" };
  }
}