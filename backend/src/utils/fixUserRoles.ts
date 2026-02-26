import mongoose from "mongoose";
import { User } from "../models/User";
import connectDB from "../config/database";
import dotenv from "dotenv";

dotenv.config();

const fixUserRoles = async () => {
  try {
    await connectDB();
    
    const usersWithoutRole = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: "user" } }
    );
    
    console.log(`Updated ${usersWithoutRole.modifiedCount} users with default role`);
    
    const allUsers = await User.find({}, 'email firstName lastName role');
    console.log("\nAll users in database:");
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName}) - Role: ${user.role}`);
    });
    
  } catch (error) {
    console.error("Error fixing user roles:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

fixUserRoles();
