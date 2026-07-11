import { UserRepository } from "../repository/user.repository";
import type { UserType } from "../types/user.types";
import type { RegisterDTOType } from "../dto/user.dto";
import bcrypt from "bcryptjs";

export const UserService = {
  async createUser(data: RegisterDTOType) {
    const emailExists = await UserRepository.existsByEmail(data.email);
    if (emailExists) throw new Error("Email already in use");

    const usernameExists = await UserRepository.existsByUsername(data.username);
    if (usernameExists) throw new Error("Username already taken");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData: UserType = {
      ...data,
      password: hashedPassword,
      role: "user",
    };

    return await UserRepository.create(userData);
  },

  async getUserById(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  },

  async getUserByEmail(email: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    return user;
  },

  async getUserByUsername(username: string) {
    const user = await UserRepository.findByUsername(username);
    if (!user) throw new Error("User not found");
    return user;
  },

  async getAllUsers() {
    return await UserRepository.findAll();
  },

  async getUsersByRole(role: "admin" | "user") {
    return await UserRepository.findAllByRole(role);
  },

  async updateUser(id: string, data: Partial<UserType>) {
    if (data.password) {
      throw new Error("Use changePassword to update password");
    }

    if (data.email) {
      const emailExists = await UserRepository.existsByEmail(data.email);
      if (emailExists) throw new Error("Email already in use");
    }

    if (data.username) {
      const usernameExists = await UserRepository.existsByUsername(data.username);
      if (usernameExists) throw new Error("Username already taken");
    }

    const updated = await UserRepository.update(id, data);
    if (!updated) throw new Error("User not found");
    return updated;
  },

  async changePassword(id: string, currentPassword: string, newPassword: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Current password is incorrect");

    if (currentPassword === newPassword) {
      throw new Error("New password must differ from current password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await UserRepository.updatePassword(id, hashedPassword);
  },

  async deleteUser(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw new Error("User not found");
    return await UserRepository.delete(id);
  },

  async validateCredentials(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    return user;
  },
};