import { JobPostModel, type IJobPost } from "../models/jobpost.model";
import type { QueryFilter } from "mongoose";

export class JobPostRepository {
  async create(data: Partial<IJobPost>): Promise<IJobPost> {
    const jobPost = new JobPostModel(data);
    return await jobPost.save();
  }

  async findById(id: string): Promise<IJobPost | null> {
    return await JobPostModel.findById(id);
  }

  async findAll(
    pageNumber: number,
    pageSize: number,
    search?: string
  ): Promise<{ jobPosts: IJobPost[]; total: number }> {
    const filter: QueryFilter<IJobPost> = {};

    if (search) {
      filter.$or = [
        { RestaurantName: { $regex: search, $options: "i" } },
        { position:       { $regex: search, $options: "i" } },
        { location:       { $regex: search, $options: "i" } },
      ];
    }

    const [jobPosts, total] = await Promise.all([
      JobPostModel.find(filter)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 }),
      JobPostModel.countDocuments(filter),
    ]);

    return { jobPosts, total };
  }

  async update(id: string, data: Partial<IJobPost>): Promise<IJobPost | null> {
    return await JobPostModel.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after" }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await JobPostModel.findByIdAndDelete(id);
    return !!result;
  }

  async incrementApplications(id: string): Promise<void> {
    await JobPostModel.findByIdAndUpdate(id, { $inc: { applications: 1 } });
  }
}