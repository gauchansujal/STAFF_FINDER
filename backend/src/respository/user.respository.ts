import { UserModel } from "../models/user.model";
import type { UserType } from "../types/user.types";
import mongoose from "mongoose";

export const UserRepository = {
  async create(data: UserType) {
    const user = new UserModel(data);
    return await user.save();
  },

  async findById(id: string) {
    return await UserModel.findById(new mongoose.Types.ObjectId(id));
  },

  async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  },

  async findByUsername(username: string) {
    return await UserModel.findOne({ username });
  },

  async findAll() {
    return await UserModel.find();
  },

  async update(id: string, data: Partial<UserType>) {
    return await UserModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { $set: data },
      { new: true, runValidators: true }
    );
  },

  async delete(id: string) {
    return await UserModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  },

  async existsByEmail(email: string): Promise<boolean> {
    const user = await UserModel.exists({ email });
    return !!user;
  },

  async existsByUsername(username: string): Promise<boolean> {
    const user = await UserModel.exists({ username });
    return !!user;
  },

  async findAllByRole(role: "admin" | "user") {
    return await UserModel.find({ role });
  },

  async updatePassword(id: string, hashedPassword: string) {
    return await UserModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { $set: { password: hashedPassword } },
      { new: true }
    );
  },
};