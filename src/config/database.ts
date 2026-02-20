import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/Customer";

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB Connected successfully");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit if database connection fails
  }
};

export default connectDB;
