import { ApplicationService } from "../services/application.service";

export const ApplicationController = {
  // POST /applications/:vacancyId
  apply: async ({ params, user, set }: any) => {
    try {
      const application = await ApplicationService.apply(user.id, params.vacancyId);
      set.status = 201;
      return { success: true, data: application };
    } catch (error: any) {
      set.status = error.message.includes("already applied") ? 409 : 400;
      return { success: false, message: error.message };
    }
  },

  // GET /applications/me
  getMyApplications: async ({ user, set }: any) => {
    try {
      const applications = await ApplicationService.getMyApplications(user.id);
      return { success: true, data: applications };
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  },

  // GET /applications/:id
  getApplicationById: async ({ params, set }: any) => {
    try {
      const application = await ApplicationService.getApplicationById(params.id);
      return { success: true, data: application };
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  },

  // GET /applications — admin only
  getAllApplications: async ({ set }: any) => {
    try {
      const applications = await ApplicationService.getAllApplications();
      return { success: true, data: applications };
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  },

  // GET /applications/vacancy/:vacancyId — admin only
  getApplicationsByVacancy: async ({ params, set }: any) => {
    try {
      const applications = await ApplicationService.getApplicationsByVacancy(params.vacancyId);
      return { success: true, data: applications };
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  },

  // PATCH /applications/:id/status — admin only
  updateStatus: async ({ params, body, set }: any) => {
    try {
      const updated = await ApplicationService.updateStatus(params.id, body.status);
      return { success: true, data: updated };
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  },

  // DELETE /applications/:id
  deleteApplication: async ({ params, set }: any) => {
    try {
      await ApplicationService.deleteApplication(params.id);
      return { success: true, message: "Application deleted" };
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  },
};