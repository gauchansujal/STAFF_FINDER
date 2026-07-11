import { ApplicationModel, type IApplication } from "../models/application.model";
import mongoose from "mongoose";

export class ApplicationRepository {
  async create(data: Partial<IApplication>): Promise<IApplication> {
    const application = new ApplicationModel(data);
    return await application.save();
  }

  async findById(id: string): Promise<IApplication | null> {
    return await ApplicationModel.findById(id)
      .populate("userId", "username email firstname lastname imageUrl")
      .populate("vacancyId");
  }

  async findByUserId(userId: string): Promise<IApplication[]> {
    return await ApplicationModel.find({
      userId: new mongoose.Types.ObjectId(userId)
    })
      .populate("vacancyId")
      .sort({ createdAt: -1 });
  }

  async findByVacancyId(vacancyId: string): Promise<IApplication[]> {
    return await ApplicationModel.find({
      vacancyId: new mongoose.Types.ObjectId(vacancyId)
    })
      .populate("userId", "username email firstname lastname imageUrl")
      .sort({ createdAt: -1 });
  }

  async findAll(): Promise<IApplication[]> {
    return await ApplicationModel.find()
      .populate("userId", "username email firstname lastname imageUrl")
      .populate("vacancyId")
      .sort({ createdAt: -1 });
  }

  async updateStatus(id: string, status: "pending" | "accepted" | "rejected"): Promise<IApplication | null> {
    return await ApplicationModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { returnDocument: "after" }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await ApplicationModel.findByIdAndDelete(id);
    return !!result;
  }

  async existsByUserAndVacancy(userId: string, vacancyId: string): Promise<boolean> {
    const result = await ApplicationModel.exists({
      userId:    new mongoose.Types.ObjectId(userId),
      vacancyId: new mongoose.Types.ObjectId(vacancyId),
    });
    return !!result;
  }
}