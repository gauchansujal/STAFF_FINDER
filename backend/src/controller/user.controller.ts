import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { UserService } from "../services/user.services";
import type { UserType } from "../types/user.types";
import { jwtConfig } from "../config/index.config";
import { authMiddleware } from "../middleware/auth.middleware";

export const userController = new Elysia({ prefix: "/users" })
  .use(jwt({ name: "jwt", secret: jwtConfig.secret }))

  // POST /users - Create user (public)
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const data: UserType = {
          ...body,
          role: body.role ?? "user",
        };
        const user = await UserService.createUser(data);
        set.status = 201;
        return {
          success: true,
          message: "User created successfully",
          data: user,
        };
      } catch (error: any) {
        set.status = 409;
        return { success: false, message: error.message };
      }
    },
    {
      body: t.Object({
        username: t.String({ minLength: 1 }),
        email: t.String(),
        password: t.String({ minLength: 6 }),
        firstname: t.Optional(t.String()),
        lastname: t.Optional(t.String()),
        role: t.Optional(t.Union([t.Literal("admin"), t.Literal("user")])),
        imageUrl: t.Optional(t.String()),
      }),
    }
  )

  // POST /users/login - Login (public) → returns token
  .post(
    "/login",
    async ({ body, set, jwt }) => {
      try {
        const user = await UserService.validateCredentials(
          body.email,
          body.password
        );

        // 👇 generate token
        const token = await jwt.sign({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        set.status = 200;
        return {
          success: true,
          message: "Login successful",
          token,        // 👈 return token
          data: user,
        };
      } catch (error: any) {
        set.status = 401;
        return { success: false, message: error.message };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )

  // 👇 all routes below are protected
  .use(authMiddleware)

  // GET /users - Get all users (protected)
  .get("/", async ({ set }) => {
    try {
      const users = await UserService.getAllUsers();
      set.status = 200;
      return { success: true, count: users.length, data: users };
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  })

  // GET /users/:id - Get user by id (protected)
  .get(
    "/:id",
    async ({ params, set }) => {
      try {
        const user = await UserService.getUserById(params.id);
        set.status = 200;
        return { success: true, data: user };
      } catch (error: any) {
        set.status = 404;
        return { success: false, message: error.message };
      }
    },
    { params: t.Object({ id: t.String() }) }
  )

  // GET /users/role/:role - Get users by role (protected)
  .get(
    "/role/:role",
    async ({ params, set }) => {
      try {
        const { role } = params;
        if (role !== "admin" && role !== "user") {
          set.status = 400;
          return { success: false, message: "Invalid role" };
        }
        const users = await UserService.getUsersByRole(role);
        return { success: true, count: users.length, data: users };
      } catch (error: any) {
        set.status = 500;
        return { success: false, message: error.message };
      }
    },
    { params: t.Object({ role: t.String() }) }
  )

  // PATCH /users/:id - Update user (protected)
  .patch(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const updated = await UserService.updateUser(params.id, body);
        set.status = 200;
        return { success: true, message: "User updated", data: updated };
      } catch (error: any) {
        set.status = error.message === "User not found" ? 404 : 409;
        return { success: false, message: error.message };
      }
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Partial(
        t.Object({
          username: t.String({ minLength: 1 }),
          email: t.String(),
          firstname: t.String(),
          lastname: t.String(),
          role: t.Union([t.Literal("admin"), t.Literal("user")]),
          imageUrl: t.String(),
        })
      ),
    }
  )

  // PATCH /users/:id/change-password (protected)
  .patch(
    "/:id/change-password",
    async ({ params, body, set }) => {
      try {
        await UserService.changePassword(
          params.id,
          body.currentPassword,
          body.newPassword
        );
        return { success: true, message: "Password changed successfully" };
      } catch (error: any) {
        set.status = error.message === "User not found" ? 404 : 400;
        return { success: false, message: error.message };
      }
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        currentPassword: t.String(),
        newPassword: t.String({ minLength: 6 }),
      }),
    }
  )

  // DELETE /users/:id (protected)
  .delete(
    "/:id",
    async ({ params, set }) => {
      try {
        await UserService.deleteUser(params.id);
        return { success: true, message: "User deleted successfully" };
      } catch (error: any) {
        set.status = 404;
        return { success: false, message: error.message };
      }
    },
    { params: t.Object({ id: t.String() }) }
  );