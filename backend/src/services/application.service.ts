import { ApplicationRepository } from "../repository/application.repository";
import { VacancyRepository } from "../repository/vacancy.repository";
import type { IApplication } from "../models/application.model";

const applicationRepo = new ApplicationRepository();
const vacancyRepo     = new VacancyRepository();

export const ApplicationService = {
  async apply(userId: string, vacancyId: string): Promise<IApplication> {
    // check vacancy exists
    const vacancy = await vacancyRepo.getVacancyById(vacancyId);
    if (!vacancy) throw new Error("Vacancy not found");

    // check already applied
    const alreadyApplied = await applicationRepo.existsByUserAndVacancy(userId, vacancyId);
    if (alreadyApplied) throw new Error("You have already applied for this vacancy");

    // snapshot vacancy data into application
    const data: Partial<IApplication> = {
      userId:         userId as any,
      vacancyId:      vacancyId as any,
      imageUrl:       vacancy.imageUrl,
      position:       vacancy.position,
      RestaurantName: vacancy.RestaurantName,
      salary:         vacancy.salary,
      location:       vacancy.location,
      jobType:        vacancy.jobType,
      description:    vacancy.description,
      requirements:   (vacancy as any).requirements ?? [],
      status:         "pending",
    };

    const application = await applicationRepo.create(data);

    // increment applications count on vacancy
    await vacancyRepo.updateVacancy(vacancyId, {
      applications: (vacancy.applications ?? 0) + 1,
    });

    return application;
  },

  async getMyApplications(userId: string): Promise<IApplication[]> {
    return await applicationRepo.findByUserId(userId);
  },

  async getApplicationById(id: string): Promise<IApplication> {
    const app = await applicationRepo.findById(id);
    if (!app) throw new Error("Application not found");
    return app;
  },

  async getAllApplications(): Promise<IApplication[]> {
    return await applicationRepo.findAll();
  },

  async getApplicationsByVacancy(vacancyId: string): Promise<IApplication[]> {
    return await applicationRepo.findByVacancyId(vacancyId);
  },

  async updateStatus(id: string, status: "pending" | "accepted" | "rejected"): Promise<IApplication> {
    const updated = await applicationRepo.updateStatus(id, status);
    if (!updated) throw new Error("Application not found");
    return updated;
  },

  async deleteApplication(id: string): Promise<void> {
    const deleted = await applicationRepo.delete(id);
    if (!deleted) throw new Error("Application not found");
  },
};