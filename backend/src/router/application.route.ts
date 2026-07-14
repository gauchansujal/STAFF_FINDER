import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { jwtConfig } from "../config/index.config";
import { UserRepository } from "../repository/user.repository";
import { ApplicationController } from "../controller/application.controller";

export const applicationRoutes = new Elysia({ prefix: "/applications" })
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

  // ✅ user routes
  .post("/:vacancyId", ApplicationController.apply, { // ✅ changed from jobPostId
    body: t.Object({
      fullName:    t.String(),
      email:       t.String(),
      phoneNumber: t.String(),
      coverLetter: t.String(),
      cvUrl:       t.String(),
    }),
  })
  .get("/me", ApplicationController.getMyApplications)
  .get("/:id", ApplicationController.getApplicationById)

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
      .get("/", ApplicationController.getAllApplications)
      .get("/vacancy/:vacancyId", ApplicationController.getApplicationsByVacancy) // ✅
      .patch("/:id/status", ApplicationController.updateStatus, {
        body: t.Object({
          status: t.Union([
            t.Literal("pending"),
            t.Literal("accepted"),
            t.Literal("rejected"),
          ]),
        }),
      })
      .delete("/:id", ApplicationController.deleteApplication)
  );