import { UserRepository } from "../../repository/user.repository";
import type { UserType } from "../../types/user.types";    
export const AdminService = {
  async getAllUsers() {
    return await UserRepository.findAll();
  },

  async getUserById(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  },

  async updateUserRole(id: string, role: "admin" | "user") {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");
    return await UserRepository.update(id, { role });
  },

  async deleteUser(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");
    return await UserRepository.delete(id);
  },

  async getUsersByRole(role: "admin" | "user") {
    return await UserRepository.findAllByRole(role);
  },
};