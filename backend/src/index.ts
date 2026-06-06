import "dotenv/config";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import connectDB from "./database/mongodb";
import { jwt } from "@elysiajs/jwt";
import { jwtConfig } from "./config/index.config";
import { userController } from "./controller/user.controller";

await connectDB();

const app = new Elysia()
  
  .use(cors())

   .use(jwt({ name: "jwt", secret: jwtConfig.secret }))
  .use(userController)
  .get("/", () => ({
    message: "hello world",
    status: "ok",
  }))
  .listen(process.env.PORT || 3000);

console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`);