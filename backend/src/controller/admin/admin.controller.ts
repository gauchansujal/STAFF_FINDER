// controller/admin/admin.controller.ts
import { UserRepository } from "../../repository/user.repository";
import bcrypt from "bcryptjs";

// ✅ Helper — converts Mongoose doc to plain object safely
function toPlain(doc: any) {
  if (!doc) return null;
  return doc.toObject ? doc.toObject() : doc;
}

export const AdminController = {

  getAllUsers: async ({ set }: any) => {
    const users = await UserRepository.findAll();
    set.status = 200;
    return { success: true, data: users.map(toPlain) };
  },

  getUserById: async ({ params, set }: any) => {
    const user = await UserRepository.findById(params.id);
    if (!user) {
      set.status = 404;
      return { success: false, message: "User not found" };
    }
    set.status = 200;
    return { success: true, data: toPlain(user) };
  },

  getUsersByRole: async ({ params, set }: any) => {
    const users = await UserRepository.findAllByRole(params.role);
    set.status = 200;
    return { success: true, data: users.map(toPlain) };
  },

  updateUserRole: async ({ params, body, set }: any) => {
    const user = await UserRepository.findById(params.id);
    if (!user) {
      set.status = 404;
      return { success: false, message: "User not found" };
    }
    const updated = await UserRepository.update(params.id, { role: body.role });
    set.status = 200;
    return { success: true, data: toPlain(updated) };
  },

  updateUser: async ({ params, body, set }: any) => {
    const user = await UserRepository.findById(params.id);
    if (!user) {
      set.status = 404;
      return { success: false, message: "User not found" };
    }

    if (body.email && body.email !== user.email) {
      const emailTaken = await UserRepository.existsByEmail(body.email);
      if (emailTaken) {
        set.status = 409;
        return { success: false, message: "Email already in use" };
      }
    }

    if (body.username && body.username !== user.username) {
      const usernameTaken = await UserRepository.existsByUsername(body.username);
      if (usernameTaken) {
        set.status = 409;
        return { success: false, message: "Username already taken" };
      }
    }

    const updated = await UserRepository.update(params.id, {
      ...(body.email     && { email:     body.email }),
      ...(body.username  && { username:  body.username }),
      ...(body.firstname && { firstname: body.firstname }),
      ...(body.lastname  && { lastname:  body.lastname }),
      ...(body.role      && { role:      body.role }),
      ...(body.imageUrl  && { imageUrl:  body.imageUrl }), // ✅ fix: was missing, so PATCH silently dropped imageUrl
    });

    set.status = 200;
    return { success: true, data: toPlain(updated) };  // ✅ plain object
  },

  changePassword: async ({ params, body, set }: any) => {
    const user = await UserRepository.findById(params.id);
    if (!user) {
      set.status = 404;
      return { success: false, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(body.currentPassword, user.password);
    if (!isMatch) {
      set.status = 400;
      return { success: false, message: "Current password is incorrect" };
    }

    const hashed = await bcrypt.hash(body.newPassword, 10);
    await UserRepository.updatePassword(params.id, hashed);

    set.status = 200;
    return { success: true, message: "Password updated successfully" };
  },

  deleteUser: async ({ params, set }: any) => {
    const user = await UserRepository.findById(params.id);
    if (!user) {
      set.status = 404;
      return { success: false, message: "User not found" };
    }
    await UserRepository.delete(params.id);
    set.status = 200;
    return { success: true, message: "User deleted successfully" };
  },
};