import dotenv from "dotenv";

// Load environment variables FIRST before any other imports
dotenv.config();

// Verify Cloudinary credentials
console.log("Cloudinary Config:");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "***" + process.env.CLOUDINARY_API_SECRET.slice(-4) : "NOT SET");

import express from "express";
import type { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.ts";
import productRoutes from "./routes/productRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes.ts";
import uploadRoutes from "./routes/uploadRoutes";

connectDB();

const app: Application = express();
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());
// Increase body size limits to 50MB for handling images and file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (_req, res) => {
  res.send("API running with TypeScript");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
