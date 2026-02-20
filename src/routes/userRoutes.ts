import express from "express";
import type { Request, Response } from "express";
import { User } from "../models/User";
import mongoose from "mongoose";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/check/:email", async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (!user) {
      return res.json({ found: false, message: "User not found" });
    }

    res.json({
      found: true,
      user: {
        email: user.email,
        firstName: user.firstName,
        passwordHashed: user.password.startsWith("$2"),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/", authenticateToken, async (_req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.patch("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    
    const updateData = { ...req.body };
    
    // Don't update password if it's empty or undefined
    if (!updateData.password) {
      delete updateData.password;
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});



export default router;
