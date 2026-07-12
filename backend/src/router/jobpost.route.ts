import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { jwtConfig } from "../config/index.config";
import { UserRepository } from "../repository/user.repository";
import { JobPostController } from "../controller/jobpost.controller";

export const jobPostRoutes = new Elysia({ prefix: "/jobposts" })
  // ✅ public routes — anyone can view
  .get("/",    JobPostController.getAllJobPosts)
  .get("/:id", JobPostController.getJobPostById)

  // ✅ protected routes — need token
  .use(jwt({ name: "jwt", secret: jwtConfig.secret }))
  .derive(async ({ jwt, headers, set }: any) => {
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

  // ✅ admin only
  .group("", (app) =>
    app
      .derive(({ userRole, set }: any) => {
        if (userRole !== "admin") {
          set.status = 403;
          throw new Error("Forbidden: Admin only");
        }
        return {};
      })
      .post("/", JobPostController.createJobPost, {
        body: t.Object({
          position:       t.String(),
          RestaurantName: t.String(),
          salary:         t.Number(),
          location:       t.String(),
          jobType:        t.Union([t.Literal("full-time"), t.Literal("part-time")]),
          description:    t.String(),
          requirements:   t.Array(t.String()),
          imageUrl:       t.Optional(t.String()),
        }),
      })
      .put("/:id", JobPostController.updateJobPost, {
        body: t.Object({
          position:       t.Optional(t.String()),
          RestaurantName: t.Optional(t.String()),
          salary:         t.Optional(t.Number()),
          location:       t.Optional(t.String()),
          jobType:        t.Optional(t.Union([t.Literal("full-time"), t.Literal("part-time")])),
          description:    t.Optional(t.String()),
          requirements:   t.Optional(t.Array(t.String())),
          imageUrl:       t.Optional(t.String()),
        }),
      })
      .delete("/:id", JobPostController.deleteJobPost)
  );