import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { UserRepository } from "../repository/user.repository";
import bcrypt from "bcrypt";

export const authRouter = new Elysia({ prefix: "/auth" })
  .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET! }))

  .post("/register", async ({ body, set }: any) => {
    const { email, password, username, firstname, lastname, role, imageUrl } = body;

    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      set.status = 409;
      return { success: false, message: "Email already in use" };
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await UserRepository.create({
      email,
      password: hashed,
      username,
      firstname,
      lastname,
      role: role ?? "user",
      imageUrl: imageUrl ?? "",
    });

    set.status = 201;
    return {
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
      username: t.String(),
      firstname: t.Optional(t.String()),
      lastname: t.Optional(t.String()),
      role: t.Optional(t.String()),
      imageUrl: t.Optional(t.String()),
    }),
  })

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
      iat: Math.floor(Date.now() / 1000),                       // ✅ unique every login
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,   // ✅ expires in 7 days
    });

    return { success: true, token };
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
  });