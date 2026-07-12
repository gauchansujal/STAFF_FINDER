import { JobPostService } from "../services/jobpost.services";

export const JobPostController = {
  // POST /jobposts — admin only
  createJobPost: async ({ body, userRole, set }: any) => {
    try {
      const jobPost = await JobPostService.createJobPost(body, userRole);
      set.status = 201;
      return { success: true, data: jobPost };
    } catch (error: any) {
      set.status = 400;
      return { success: false, message: error.message };
    }
  },

  // GET /jobposts
  getAllJobPosts: async ({ query, set }: any) => {
    try {
      const { page, size, search } = query;
      const result = await JobPostService.getAllJobPosts(page, size, search);
      return { success: true, ...result };
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  },

  // GET /jobposts/:id
  getJobPostById: async ({ params, set }: any) => {
    try {
      const jobPost = await JobPostService.getJobPostById(params.id);
      return { success: true, data: jobPost };
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  },

  // PUT /jobposts/:id — admin only
  updateJobPost: async ({ params, body, userRole, set }: any) => {
    try {
      const updated = await JobPostService.updateJobPost(params.id, body, userRole);
      return { success: true, data: updated };
    } catch (error: any) {
      set.status = 400;
      return { success: false, message: error.message };
    }
  },

  // DELETE /jobposts/:id — admin only
  deleteJobPost: async ({ params, userRole, set }: any) => {
    try {
      await JobPostService.deleteJobPost(params.id, userRole);
      return { success: true, message: "Job post deleted" };
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  },
};