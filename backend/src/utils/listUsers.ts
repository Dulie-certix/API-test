import mongoose from "mongoose";
import User from "../models/User.ts";
import connectDB from "../config/database.ts";
import dotenv from "dotenv";

dotenv.config();

const listUsers = async () => {
  try {
    await connectDB();

    const users = await User.find(
      {},
      "firstName lastName email username role password",
    );
    console.log("Users in database:");
    users.forEach((user) => {
      console.log(
        `- ${user.firstName} ${user.lastName}: ${user.email} (${user.username}) - Role: ${user.role} - Password starts with: ${user.password.substring(0, 10)}...`,
      );
    });
  } catch (error) {
    console.error("Error listing users:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

listUsers();
