import { Elysia } from "elysia";
import { UserRepository } from "../repository/user.repository";

// ── Auth Middleware (verify token + attach user) ──────────────
export const authMiddleware = new Elysia()
  .derive(async ({ jwt, headers, set }: { jwt: any; headers: any; set: any }) => {
    const authorization = headers["authorization"];

    if (!authorization || !authorization.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("Unauthorized: Invalid JWT format");
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      set.status = 401;
      throw new Error("Unauthorized: JWT token missing");
    }

    const decodedToken = await jwt.verify(token);

    if (!decodedToken || !decodedToken.id) {
      set.status = 401;
      throw new Error("Unauthorized: JWT invalid or no id");
    }

    // ✅ No "new" — use UserRepository directly as a plain object
    const user = await UserRepository.findById(decodedToken.id);

    if (!user) {
      set.status = 401;
      throw new Error("Unauthorized: User not found");
    }

    return { user };
  });

// ── Admin Middleware (must be used after authMiddleware) ──────
export const adminMiddleware = new Elysia()
  .derive(async ({ user, set }: { user: any; set: any }) => {
    if (!user) {
      set.status = 401;
      throw new Error("Unauthorized: No user information");
    }

    if (user.role !== "admin") {
      set.status = 403;
      throw new Error("Forbidden: Admin access required");
    }

    return {};
  });