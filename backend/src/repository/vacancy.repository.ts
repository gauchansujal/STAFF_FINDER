import { VacancyModel, type IVacancy } from "../models/vacancy.model";
import { QueryFilter } from "mongoose";

export interface IVacancyRepository {
  getVacancyById(id: string): Promise<IVacancy | null>;
  getAllVacancy(pageNumber: number, pageSize: number, search?: string): Promise<{ Vacancy: IVacancy[]; total: number }>;
  createVacancy(data: Partial<IVacancy>): Promise<IVacancy>;
  updateVacancy(id: string, updateData: Partial<IVacancy>): Promise<IVacancy | null>;
  deleteVacancy(id: string): Promise<boolean>;
}

export class VacancyRepository implements IVacancyRepository {

  async getVacancyById(id: string): Promise<IVacancy | null> {
    return await VacancyModel.findById(id);
  }

  async getAllVacancy(
    pageNumber: number,
    pageSize: number,
    search?: string
  ): Promise<{ Vacancy: IVacancy[]; total: number }> {
    const filter: QueryFilter<IVacancy> = {};

    if (search) {
      filter.$or = [
        { RestaurantName: { $regex: search, $options: "i" } },
        { position:       { $regex: search, $options: "i" } },
        { location:       { $regex: search, $options: "i" } }, // ✅ added
        { description:    { $regex: search, $options: "i" } }, // ✅ added
      ];
    }

    const [Vacancy, total] = await Promise.all([
      VacancyModel.find(filter)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 }), // ✅ newest first
      VacancyModel.countDocuments(filter),
    ]);

    return { Vacancy, total };
  }

  async createVacancy(data: Partial<IVacancy>): Promise<IVacancy> {
    const vacancy = new VacancyModel(data);
    return await vacancy.save();
  }

  async updateVacancy(id: string, updateData: Partial<IVacancy>): Promise<IVacancy | null> {
    return await VacancyModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: "after" } // ✅ fixed deprecated { new: true }
    );
  }

  async deleteVacancy(id: string): Promise<boolean> {
    const result = await VacancyModel.findByIdAndDelete(id);
    return !!result;
  }
}