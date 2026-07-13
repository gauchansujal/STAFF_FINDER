import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { jwtConfig } from "../config/index.config";
import { UserRepository } from "../repository/user.repository";
import {
  getAllVacancy, getVacancyById,
  createVacancy, updateVacancy, deleteVacancy
} from "../controller/vacancy.controller";

export const vacancyRoutes = new Elysia({ prefix: "/vacancy" })
  // public
  .get("/", getAllVacancy)
  .get("/:id", getVacancyById)

  // protected
  .use(jwt({ name: "jwt", secret: jwtConfig.secret }))
  .derive(async ({ jwt, headers, set }) => {
    const authorization = headers["authorization"];
    if (!authorization?.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("Unauthorized");
    }
    const token   = authorization.split(" ")[1];
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

  // admin only
  .post("/", createVacancy, {
    body: t.Object({
      RestaurantName: t.String(),
      location:       t.String(),
      salary:         t.Number(),
      position:       t.String(),
      jobType:        t.Union([t.Literal("full-time"), t.Literal("part-time")]),
      description:    t.String(),
      requirements:   t.Optional(t.Array(t.String())), // ✅
      imageUrl:       t.Optional(t.String()),
      applications:   t.Optional(t.Number()),
    }),
  })
  .put("/:id", updateVacancy, {
    body: t.Object({
      RestaurantName: t.Optional(t.String()),
      location:       t.Optional(t.String()),
      salary:         t.Optional(t.Number()),
      position:       t.Optional(t.String()),
      jobType:        t.Optional(t.Union([t.Literal("full-time"), t.Literal("part-time")])),
      description:    t.Optional(t.String()),
      requirements:   t.Optional(t.Array(t.String())), // ✅
      imageUrl:       t.Optional(t.String()),
    }),
  })
  .delete("/:id", deleteVacancy);