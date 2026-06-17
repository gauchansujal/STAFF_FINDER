import {z} from "zod";

export const VacancySchema = z.object({
    RestaurantName: z.string().max(100),
    location: z.string(),
    imageUrl:z.string().url().optional(),
    salary: z.number().positive(),
    position: z.string(),
    jobType: z.enum(["full-time", "part-time"]),
    description: z.string().min(20),
    applications: z.number().min(0).default(0),


});

export type VacancyType = z.infer<typeof VacancySchema>;