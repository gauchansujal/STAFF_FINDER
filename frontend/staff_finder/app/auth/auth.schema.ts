import { z } from "zod";

// ── Login ──────────────────────────────────────────────────────────────────
export const LoginDTO = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginDTOType = z.infer<typeof LoginDTO>;

// ── Register ───────────────────────────────────────────────────────────────
export const RegisterDTO = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be under 30 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  firstname: z.string().optional(),
  lastname:  z.string().optional(),
  imageUrl:  z.string().url("Invalid image URL").optional(), // ✅ added
});

export type RegisterDTOType = z.infer<typeof RegisterDTO>;