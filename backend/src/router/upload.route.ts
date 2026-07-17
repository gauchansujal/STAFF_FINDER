import { Elysia, t } from "elysia";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadRoute = new Elysia({ prefix: "/upload" })
  .post("/", async ({ body, set }: any) => {
    const file = body.file as File;

    if (!file) {
      set.status = 400;
      return { error: "No file provided" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder:        "staff-finder-uploads",
      resource_type: "auto", // ✅ auto detects image, pdf, doc etc
    });

    return {
      success:  true,
      url:      result.secure_url,
      publicId: result.public_id,
    };
  }, {
    body: t.Object({
      file: t.File(), // ✅ removed type restriction — accepts all files
    }),
  });