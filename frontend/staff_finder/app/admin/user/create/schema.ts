import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// ─── Create User ───────────────────────────────────────────
export const CreateUserSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),

  password: z.string().min(6, { message: "Minimum 6 characters" }),

  confirmPassword: z.string().min(6, { message: "Minimum 6 characters" }),

  firstName: z.string().min(1, { message: "First name is required" }),

  lastName: z.string().optional(),

  username: z.string().min(3, { message: "Username must be at least 3 characters" }),

  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    }),
})
.refine((v) => v.password === v.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

export type CreateUserData = z.infer<typeof CreateUserSchema>;

// ─── Update User ───────────────────────────────────────────
export const UpdateUserSchema = z.object(CreateUserSchema.shape).partial();

export type UpdateUserData = z.infer<typeof UpdateUserSchema>;

// ─── Change Password ───────────────────────────────────────
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z.string().min(6, { message: "Minimum 6 characters" }),
    confirmNewPassword: z.string().min(6, { message: "Minimum 6 characters" }),
  })
  .refine((v) => v.newPassword === v.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;