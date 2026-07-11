import "dotenv/config";
import connectDB from "../database/mongodb";
import { UserRepository } from "../repository/user.repository";
import bcrypt from "bcryptjs";

await connectDB();

const existing = await UserRepository.findByEmail(process.env.ADMIN_EMAIL!);

if (existing) {
  console.log("✅ Admin already exists");
  process.exit(0);
}

const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

await UserRepository.create({
  username:  "sujalgauchan",
  email:     process.env.ADMIN_EMAIL!,
  password:  hashedPassword,
  firstname: "Sujal",
  lastname:  "Gauchan",
  role:      "admin",
});

console.log("✅ Admin seeded successfully");
process.exit(0);