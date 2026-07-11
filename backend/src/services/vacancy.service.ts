import type{ IVacancy } from "../models/vacancy.model";

import { VacancyRepository } from "../repository/vacancy.repository";

// ✅ Define a return type for paginated response
export interface PaginatedVacancy {
  Vacancy: IVacancy[];
  pagination: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
}


export class VacancyService{
    private repo = new VacancyRepository();


async getVacancyById(id: string): Promise<IVacancy | null> {
    return await this.repo.getVacancyById(id);
}
      // ✅ Fixed return type
 async getAllVacancy(page?: string, size?: string, search?: string) {
    const pageNumber = page ? parseInt(page) : 1;   // default page 1
    const pageSize = size ? parseInt(size) : 10;    // default 10 items

    // get data from repo
    const { Vacancy, total } = await this.repo.getAllVacancy(pageNumber, pageSize, search);

    // calculate pagination info
    const pagination = {
        page: pageNumber,
        size: pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize), // e.g. 25 items / 10 = 3 pages
    };

    return { Vacancy, pagination };
}

  async createVacancy(data: Partial<IVacancy>, userRole:string): Promise<IVacancy>{
    if(userRole !== "admin"){
        throw new Error("Unauthorized: Only admin can create vacancy");
    }
    return await this.repo.createVacancy(data);
  }
    // Admin only
  async updateVacancy(id: string, data: Partial<IVacancy>, userRole: string): Promise<IVacancy | null> {
    if (userRole !== "admin") {
      throw new Error("Unauthorized: Only admin can update bikes");
    }
    return await this.repo.updateVacancy(id, data);
  }

  // Admin only
  async deleteVacancy(id: string, userRole: string): Promise<boolean> {
    if (userRole !== "admin") {
      throw new Error("Unauthorized: Only admin can delete bikes");
    }
    return await this.repo.deleteVacancy(id);
  }
}