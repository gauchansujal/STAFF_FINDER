import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { jwtConfig } from "../config/index.config";
import { UserRepository } from "../repository/user.repository";
import {
  getAllVacancy, getVacancyById,
  createVacancy, updateVacancy, deleteVacancy
} from "../controller/vacancy.controller";

export const vacancyRoutes = new Elysia({ prefix: "/vacancy" })
  .get("/", getAllVacancy)
  .get("/:id", getVacancyById)
  .use(jwt({ name: "jwt", secret: jwtConfig.secret }))
  .derive(async ({ jwt, headers, set }) => {
    const authorization = headers["authorization"];
    if (!authorization?.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("Unauthorized");
    }
    const token = authorization.split(" ")[1];
    const decoded = await jwt.verify(token) as any;
    if (!decoded?.id) {
      set.status = 401;
      throw new Error("Invalid token");
    }
    const user = await UserRepository.findById(decoded.id);
    if (!user) {
      set.status = 401;
      throw new Error("User not found");
    }
    return { user, userRole: user.role as string };
  })
  .post("/", createVacancy)
  .put("/:id", updateVacancy)
  .delete("/:id", deleteVacancy);