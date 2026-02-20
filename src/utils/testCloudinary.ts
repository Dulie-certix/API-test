import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

console.log("Testing Cloudinary Configuration...\n");

console.log("Environment Variables:");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "***" + process.env.CLOUDINARY_API_SECRET.slice(-4) : "NOT SET");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("\nTesting Cloudinary connection...");

cloudinary.api.ping()
  .then((result) => {
    console.log("✅ Cloudinary connection successful!");
    console.log("Response:", result);
  })
  .catch((error) => {
    console.error("❌ Cloudinary connection failed!");
    console.error("Error:", error.message);
    console.error("Full error:", error);
  });
