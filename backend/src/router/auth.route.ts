import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { UserRepository } from "../repository/user.repository";
import bcrypt from "bcrypt";

export const authRouter = new Elysia({ prefix: "/auth" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET! }))
  .post("/login", async ({ body, jwt, set }: any) => {
    const { email, password } = body;

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      set.status = 401;
      return { success: false, message: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      set.status = 401;
      return { success: false, message: "Invalid credentials" };
    }

    const token = await jwt.sign({
      id: user._id.toString(),
      role: user.role,
    });

    return { success: true, token };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    })
  });