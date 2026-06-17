import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { UserRepository } from "../../repository/user.repository";
import { AdminController } from "../../controller/admin/admin.controller";

const jwtConfig = jwt({ name: "jwt", secret: process.env.JWT_SECRET! });

export const adminRouter = new Elysia({ prefix: "/admin" })
  .use(jwtConfig)
  .derive(async ({ jwt, headers, set }: any) => {
    const authorization = headers["authorization"];

    if (!authorization?.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("Unauthorized: Missing or invalid token");
    }

    const token = authorization.split(" ")[1];
    const decoded = await jwt.verify(token);

    if (!decoded?.id) {
      set.status = 401;
      throw new Error("Unauthorized: Invalid token");
    }

    const user = await UserRepository.findById(decoded.id);

    if (!user) {
      set.status = 401;
      throw new Error("Unauthorized: User not found");
    }

    if (user.role !== "admin") {
      set.status = 403;
      throw new Error("Forbidden: Admins only");
    }

    return { user };
  })
  .get("/users",             AdminController.getAllUsers)
  .get("/users/:id",         AdminController.getUserById)
  .patch("/users/:id/role",  AdminController.updateUserRole)
  .delete("/users/:id",                 AdminController.deleteUser)
  .patch("/users/:id",                  AdminController.updateUser)       // ✅ NEW

  .get("/users/role/:role",  AdminController.getUsersByRole);