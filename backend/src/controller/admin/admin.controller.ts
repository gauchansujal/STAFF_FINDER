import { AdminService } from "../../services/admin/admin.services";

export const AdminController = {
  getAllUsers: async ({ set }: { set: any }) => {
    try {
      const users = await AdminService.getAllUsers();
      return { success: true, count: users.length, data: users };
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  },

  getUserById: async ({ params, set }: { params: { id: string }; set: any }) => {
    try {
      const user = await AdminService.getUserById(params.id);
      return { success: true, data: user };
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  },

  updateUserRole: async ({ params, body, set }: { params: { id: string }; body: { role: "admin" | "user" }; set: any }) => {
    try {
      const updated = await AdminService.updateUserRole(params.id, body.role);
      return { success: true, message: "Role updated", data: updated };
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  },

  deleteUser: async ({ params, set }: { params: { id: string }; set: any }) => {
    try {
      await AdminService.deleteUser(params.id);
      return { success: true, message: "User deleted successfully" };
    } catch (error: any) {
      set.status = 404;
      return { success: false, message: error.message };
    }
  },

  getUsersByRole: async ({ params, set }: { params: { role: "admin" | "user" }; set: any }) => {
    try {
      const users = await AdminService.getUsersByRole(params.role);
      return { success: true, count: users.length, data: users };
    } catch (error: any) {
      set.status = 500;
      return { success: false, message: error.message };
    }
  },
};