import { VacancyModel, type IVacancy } from "../models/vacancy.model";
import { QueryFilter } from "mongoose"; // ✅ removed type

export interface IVacancyRepository {
    getVacancyById(id: string): Promise<IVacancy | null>;
    getAllVacancy(pageNumber: number, pageSize: number, search?: string): Promise<{ Vacancy: IVacancy[]; total: number }>;
    createVacancy(userData: Partial<IVacancy>): Promise<IVacancy>;
    updateVacancy(id: string, updateData: Partial<IVacancy>): Promise<IVacancy | null>; // ✅ fixed name
    deleteVacancy(id: string): Promise<boolean>;
}

export class VacancyRepository implements IVacancyRepository {

    async getVacancyById(id: string): Promise<IVacancy | null> {
        return await VacancyModel.findById(id);
    }

    async getAllVacancy(pageNumber: number, pageSize: number, search?: string): Promise<{ Vacancy: IVacancy[]; total: number }> {
        const filter: QueryFilter<IVacancy> = {};

        if (search) {
            filter.$or = [
                { RestaurantName: { $regex: search, $options: 'i' } },
                { position: { $regex: search, $options: 'i' } },
            ];
        }

        const [Vacancy, total] = await Promise.all([
            VacancyModel.find(filter).skip((pageNumber - 1) * pageSize).limit(pageSize),
            VacancyModel.countDocuments(filter),
        ]);

        return { Vacancy, total };
    }

    async createVacancy(userData: Partial<IVacancy>): Promise<IVacancy> {
        const Vacancy = new VacancyModel(userData);
        return await Vacancy.save();
    }

    async updateVacancy(id: string, updateData: Partial<IVacancy>): Promise<IVacancy | null> {
        return await VacancyModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async deleteVacancy(id: string): Promise<boolean> {
        const result = await VacancyModel.findByIdAndDelete(id);
        return result ? true : false;
    }
}