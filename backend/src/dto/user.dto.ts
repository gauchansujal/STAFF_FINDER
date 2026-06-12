import { z } from "zod";

// ─────────────────────────────────────────
// 1. REGISTER DTO
// ─────────────────────────────────────────
export const RegisterDTO = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(30, "Username must be at most 30 characters"),

  email: z
    .string()
    .email("Please provide a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password too long"),

  firstname: z
    .string()
    .min(2, "Firstname too short")
    .optional(),

  lastname: z
    .string()
    .min(2, "Lastname too short")
    .optional(),

  imageUrl: z
    .string()
    .url("Invalid image URL")
    .optional(),
});

export type RegisterDTOType = z.infer<typeof RegisterDTO>;

// ─────────────────────────────────────────
// 2. LOGIN DTO
// ─────────────────────────────────────────
export const LoginDTO = z.object({
  email: z
    .string()
    .email("Please provide a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginDTOType = z.infer<typeof LoginDTO>;

// ─────────────────────────────────────────
// 3. UPDATE USER DTO
// ─────────────────────────────────────────
export const UpdateUserDTO = z.object({
  username: z
    .string()
    .min(2, "Username too short")
    .max(30, "Username too long")
    .optional(),

  firstname: z
    .string()
    .min(2, "Firstname too short")
    .optional(),

  lastname: z
    .string()
    .min(2, "Lastname too short")
    .optional(),

  imageUrl: z
    .string()
    .url("Invalid image URL")
    .optional(),
});

export type UpdateUserDTOType = z.infer<typeof UpdateUserDTO>;

// ─────────────────────────────────────────
// 4. CHANGE PASSWORD DTO
// ─────────────────────────────────────────
export const ChangePasswordDTO = z.object({
  oldPassword: z
    .string()
    .min(6, "Old password too short"),

  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(50, "New password too long"),

  confirmPassword: z
    .string()
    .min(6, "Confirm password too short"),

}).refine(
  (data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ChangePasswordDTOType = z.infer<typeof ChangePasswordDTO>;

// ─────────────────────────────────────────
// 5. RESPONSE DTO  (what we send back)
// ─────────────────────────────────────────
export const UserResponseDTO = z.object({
  id:        z.string(),
  username:  z.string(),
  email:     z.string(),
  role:      z.string(),
  firstname: z.string().optional(),
  lastname:  z.string().optional(),
  imageUrl:  z.string().optional(),
  createdAt: z.date().optional(),
  // ❌ password NOT included — never send password!
});

export type UserResponseDTOType = z.infer<typeof UserResponseDTO>;