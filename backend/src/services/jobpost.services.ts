import { JobPostRepository } from "../repository/jobpost.repository";
import type { IJobPost } from "../models/jobpost.model";

const jobPostRepo = new JobPostRepository();

export interface PaginatedJobPosts {
  jobPosts: IJobPost[];
  pagination: {
    page:       number;
    size:       number;
    totalItems: number;
    totalPages: number;
  };
}

export const JobPostService = {
  async createJobPost(data: Partial<IJobPost>, userRole: string): Promise<IJobPost> {
    if (userRole !== "admin") throw new Error("Unauthorized: Only admin can create job posts");
    return await jobPostRepo.create(data);
  },

  async getJobPostById(id: string): Promise<IJobPost> {
    const jobPost = await jobPostRepo.findById(id);
    if (!jobPost) throw new Error("Job post not found");
    return jobPost;
  },

  async getAllJobPosts(
    page?: string,
    size?: string,
    search?: string
  ): Promise<PaginatedJobPosts> {
    const pageNumber = page ? parseInt(page) : 1;
    const pageSize   = size ? parseInt(size) : 10;

    const { jobPosts, total } = await jobPostRepo.findAll(pageNumber, pageSize, search);

    return {
      jobPosts,
      pagination: {
        page:       pageNumber,
        size:       pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async updateJobPost(
    id: string,
    data: Partial<IJobPost>,
    userRole: string
  ): Promise<IJobPost> {
    if (userRole !== "admin") throw new Error("Unauthorized: Only admin can update job posts");
    const updated = await jobPostRepo.update(id, data);
    if (!updated) throw new Error("Job post not found");
    return updated;
  },

  async deleteJobPost(id: string, userRole: string): Promise<void> {
    if (userRole !== "admin") throw new Error("Unauthorized: Only admin can delete job posts");
    const deleted = await jobPostRepo.delete(id);
    if (!deleted) throw new Error("Job post not found");
  },

  async incrementApplications(id: string): Promise<void> {
    await jobPostRepo.incrementApplications(id);
  },
};