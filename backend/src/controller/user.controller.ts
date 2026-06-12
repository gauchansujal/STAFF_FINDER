import { UserService } from "../services/user.services";
import {
  type RegisterDTOType,
  type LoginDTOType,
  type UpdateUserDTOType,
  type ChangePasswordDTOType,
} from "./../dto/user.dto";

export const UserController = {

  // POST /users — register
  register: async ({ body, set, jwt }: { body: RegisterDTOType; set: any; jwt: any }) => {
    try {
      const user = await UserService.createUser(body);
      set.status = 201;
      return { success: true, message: "User created successfully", data: user };
    } catch (error: any) {
      set.status = 409;
      return { success: false, message: error.message };
    }
  },

  // POST /users/login
  login: async ({ body, set, jwt }: { body: LoginDTOType; set: any; jwt: any }) => {
    try {
      const user = await UserService.validateCredentials(body.email, body.password);
      const token = await jwt.sign({ id: user.id, email: user.email, role: user.role });
      set.status = 200;
      return { success: true, message: "Login successful", token, data: user };
    } catch (error: any) {
      set.status = 401;
      return { success: false, message: error.message };
    }
  },

  // GET /users
  getAllUsers: async ({ set }: { set: any }) => {
    try {
      const users = await UserService.getAllUsers();
      return { success: true, count: users.length, data: users };
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  },

  // GET /users/:id
  getUserById: async ({ params, set }: { params: { id: string }; set: any }) => {
    try {
      const user = await UserService.getUserById(params.id);
      return { success: true, data: user };
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  },

  // PATCH /users/:id
  updateUser: async ({ params, body, set }: { params: { id: string }; body: UpdateUserDTOType; set: any }) => {
    try {
      const updated = await UserService.updateUser(params.id, body);
      return { success: true, message: "User updated", data: updated };
    } catch (error: any) {
      set.status = error.message === "User not found" ? 404 : 409;
      return { success: false, message: error.message };
    }
  },

  // PATCH /users/:id/change-password
  changePassword: async ({ params, body, set }: { params: { id: string }; body: ChangePasswordDTOType; set: any }) => {
    try {
      await UserService.changePassword(params.id, body.oldPassword, body.newPassword);
      return { success: true, message: "Password changed successfully" };
    } catch (error: any) {
      set.status = error.message === "User not found" ? 404 : 400;
      return { success: false, message: error.message };
    }
  },

  // DELETE /users/:id
  deleteUser: async ({ params, set }: { params: { id: string }; set: any }) => {
    try {
      await UserService.deleteUser(params.id);
      return { success: true, message: "User deleted successfully" };
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  },
};