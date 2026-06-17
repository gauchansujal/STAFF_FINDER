import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { UserRepository } from "../repository/user.repository";
import { jwtConfig } from "../config/index.config"; // ✅ same config

const jwtPlugin = jwt({ name: "jwt", secret: jwtConfig.secret }); // ✅ same secret

export const authMiddleware = new Elysia()
  .use(jwtPlugin)
  .derive(async ({ jwt, headers, set }) => {
    const authorization = headers["authorization"];

    if (!authorization?.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("Unauthorized: Invalid JWT format");
    }

    const token = authorization.split(" ")[1];
    const decodedToken = await jwt.verify(token);

    console.log("DECODED TOKEN:", JSON.stringify(decodedToken));

    if (!decodedToken || !decodedToken.id) {
      set.status = 401;
      throw new Error("Unauthorized: JWT invalid or no id");
    }

    const user = await UserRepository.findById(decodedToken.id as string);

    console.log("USER FROM DB:", JSON.stringify(user));
    console.log("USER ROLE:", user?.role);

    if (!user) {
      set.status = 401;
      throw new Error("Unauthorized: User not found");
    }

    return {
      user,
      userRole: user.role as string,
    };
  });