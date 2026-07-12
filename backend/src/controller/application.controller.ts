import { ApplicationService } from "../services/application.service";

export const ApplicationController = {
  // POST /applications/:jobPostId
  apply: async ({ params, body, user, set }: any) => {
    try {
      const application = await ApplicationService.apply(
        user.id,
        params.jobPostId,
        {
          fullName:    body.fullName,
          email:       body.email,
          phoneNumber: body.phoneNumber,
          coverLetter: body.coverLetter,
          cvUrl:       body.cvUrl,
        }
      );
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

  // GET /applications/jobpost/:jobPostId — admin only
  getApplicationsByJobPost: async ({ params, set }: any) => {
    try {
      const applications = await ApplicationService.getApplicationsByJobPost(params.jobPostId);
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

  // DELETE /applications/:id — admin only
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