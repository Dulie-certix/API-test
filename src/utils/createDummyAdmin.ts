import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.ts";
import connectDB from "../config/database.ts";
import dotenv from "dotenv";

dotenv.config();

const createDummyUsers = async () => {
  try {
    await connectDB();

    // Check if users already exist
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    const existingUser = await User.findOne({ email: "user@example.com" });

    if (existingAdmin && existingUser) {
      console.log("Dummy users already exist");
      console.log("Admin - Email: admin@example.com, Password: admin123");
      console.log("User - Email: user@example.com, Password: user123");
      process.exit(0);
    }

    // Create admin user
    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash("admin123", 10);
      const admin = new User({
        firstName: "Admin",
        lastName: "User",
        age: 30,
        gender: "Male",
        email: "admin@example.com",
        phone: "1234567890",
        username: "admin",
        password: adminPassword,
        role: "admin",
      });
      await admin.save();
      console.log("Admin user created successfully");
    }

    // Create regular user
    if (!existingUser) {
      const userPassword = await bcrypt.hash("user123", 10);
      const user = new User({
        firstName: "Regular",
        lastName: "User",
        age: 25,
        gender: "Female",
        email: "user@example.com",
        phone: "0987654321",
        username: "user",
        password: userPassword,
        role: "user",
      });
      await user.save();
      console.log("Regular user created successfully");
    }

    console.log("\nTest Accounts Created:");
    console.log("Admin Account:");
    console.log("  Email: admin@example.com");
    console.log("  Password: admin123");
    console.log("  Access: Full system access including user management");
    console.log("\nRegular User Account:");
    console.log("  Email: user@example.com");
    console.log("  Password: user123");
    console.log("  Access: Dashboard and products only (no user management)");
  } catch (error) {
    console.error("Error creating dummy users:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

createDummyUsers();
