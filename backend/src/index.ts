import "dotenv/config";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import connectDB from "./database/mongodb";
import { jwtConfig } from "./config/index.config";
import { authRouter } from "./router/auth.route";
import { adminRouter } from "./router/admin/admin.route";
import { vacancyRoutes } from "./router/vacancy.route";
import {uploadRoute} from "./router/upload.route";


await connectDB();

const app = new Elysia()
 .use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))
  .use(staticPlugin({ assets: "uploads", prefix: "/uploads" })) // ✅
  .use(authRouter)
  .use(adminRouter)
  .use(vacancyRoutes)
  .use(uploadRoute)   
  .get("/", () => ({ message: "hello world", status: "ok" }))
  .listen(process.env.PORT || 5000);

console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);