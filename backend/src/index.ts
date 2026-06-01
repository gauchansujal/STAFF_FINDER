import "dotenv/config"; // 👈 must be first line
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import connectDB from "./database/mongodb";

await connectDB();

const app = new Elysia()
  .use(cors())
  .get("/", () => ({
    message: "hello world",
    status: "ok",
  }))
  .listen(process.env.PORT || 3000);

console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`);