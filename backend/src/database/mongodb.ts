import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI is not defined in .env file");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB...");

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
      retryWrites: true,
    });

    mongoose.connection.on("connected", () => {
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      console.log(`📦 Database: ${mongoose.connection.name}`);
    });

    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB Error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected");
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error}`);
    process.exit(1);
  }
};

export default connectDB;