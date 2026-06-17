import { VacancyService } from "../services/vacancy.services";
import type { Context } from "elysia";

type AuthContext = Context & { user: any; userRole: string };

const vacancyService = new VacancyService();

export const getAllVacancy = async ({ query }: Context) => {
  const { page, size, search } = query;
  return await vacancyService.getAllVacancy(page, size, search);
};

export const getVacancyById = async ({ params }: Context) => {
  const { id } = params;
  if (!id) return { message: "ID is required" };
  const vacancy = await vacancyService.getVacancyById(id);
  if (!vacancy) return { message: "Vacancy not found" };
  return vacancy;
};

export const createVacancy = async ({ body, userRole }: AuthContext) => {
  return await vacancyService.createVacancy(body as any, userRole); // ✅ userRole from derive
};

export const updateVacancy = async ({ params, body, userRole }: AuthContext) => {
  const { id } = params;
  if (!id) return { message: "ID is required" };
  return await vacancyService.updateVacancy(id, body as any, userRole);
};

export const deleteVacancy = async ({ params, userRole }: AuthContext) => {
  const { id } = params;
  if (!id) return { message: "ID is required" };
  return await vacancyService.deleteVacancy(id, userRole);
};