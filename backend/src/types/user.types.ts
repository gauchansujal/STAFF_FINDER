import {z} from "zod";

export const UserSchema = z.object({
    username: z.string().min(1),
    email: z.string(),
    password: z.string().min(6),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    role:z.enum(["admin","user"]).optional().default("user"),
    imageUrl: z.string().optional(),
});
export type UserType = z.infer<typeof UserSchema>;