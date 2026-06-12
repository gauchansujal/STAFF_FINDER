import "dotenv/config";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import connectDB from "./database/mongodb";
import { jwt } from "@elysiajs/jwt";
import { jwtConfig } from "./config/index.config";
import { authRouter } from "./router/auth.route";
import {adminRouter} from "./router/admin/admin.route";

await connectDB();

const app = new Elysia()
  
  .use(cors())
  .use(jwt({ name: "jwt", secret: jwtConfig.secret }))
  .use(authRouter)
  .use(adminRouter)
  .get("/", () => ({
    message: "hello world",
    status: "ok",
  }))
  .listen(process.env.PORT || 3000);

console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`);