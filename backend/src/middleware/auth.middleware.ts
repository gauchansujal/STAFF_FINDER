import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { jwtConfig } from "../config/index.config";

export const authMiddleware = new Elysia()
  .use(jwt({ name: "jwt", secret: jwtConfig.secret }))
  .derive(async ({ jwt, headers, set }) => {
    const authorization = headers["authorization"];

    if (!authorization) {
      set.status = 401;
      throw new Error("Unauthorized: No token provided");
    }

    const token = authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!token) {
      set.status = 401;
      throw new Error("Unauthorized: Invalid token format");
    }

    const payload = await jwt.verify(token);

    if (!payload) {
      set.status = 401;
      throw new Error("Unauthorized: Invalid or expired token");
    }

    return { user: payload }; // 👈 available as ctx.user in routes
  });