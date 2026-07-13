import { VacancyService } from "../services/vacancy.service";
import type { Context } from "elysia";

type AuthContext = Context & { user: any; userRole: string };

const vacancyService = new VacancyService();

export const getAllVacancy = async ({ query, set }: Context) => {
  try {
    const { page, size, search } = query;
    return await vacancyService.getAllVacancy(page, size, search);
  } catch (error: any) {
    set.status = 500;
    return { success: false, message: error.message };
  }
};

export const getVacancyById = async ({ params, set }: Context) => {
  try {
    const { id } = params;
    if (!id) {
      set.status = 400;
      return { success: false, message: "ID is required" };
    }
    const vacancy = await vacancyService.getVacancyById(id);
    if (!vacancy) {
      set.status = 404;
      return { success: false, message: "Vacancy not found" };
    }
    return { success: true, data: vacancy };
  } catch (error: any) {
    set.status = 500;
    return { success: false, message: error.message };
  }
};

export const createVacancy = async ({ body, userRole, set }: AuthContext) => {
  try {
    const vacancy = await vacancyService.createVacancy(body as any, userRole);
    set.status = 201;
    return { success: true, data: vacancy };
  } catch (error: any) {
    set.status = error.message.includes("Unauthorized") ? 403 : 400;
    return { success: false, message: error.message };
  }
};

export const updateVacancy = async ({ params, body, userRole, set }: AuthContext) => {
  try {
    const { id } = params;
    if (!id) {
      set.status = 400;
      return { success: false, message: "ID is required" };
    }
    const updated = await vacancyService.updateVacancy(id, body as any, userRole);
    if (!updated) {
      set.status = 404;
      return { success: false, message: "Vacancy not found" };
    }
    return { success: true, data: updated };
  } catch (error: any) {
    set.status = error.message.includes("Unauthorized") ? 403 : 400;
    return { success: false, message: error.message };
  }
};

export const deleteVacancy = async ({ params, userRole, set }: AuthContext) => {
  try {
    const { id } = params;
    if (!id) {
      set.status = 400;
      return { success: false, message: "ID is required" };
    }
    await vacancyService.deleteVacancy(id, userRole);
    return { success: true, message: "Vacancy deleted successfully" };
  } catch (error: any) {
    set.status = error.message.includes("Unauthorized") ? 403 : 404;
    return { success: false, message: error.message };
  }
};