import express from "express";
import type { Request, Response } from "express";
import { User } from "../models/User";
import mongoose from "mongoose";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import { uploadToS3, uploadFileToS3 } from "../middleware/s3Upload";
import { generatePassword } from "../utils/generatePassword";
import { sendPasswordEmail } from "../services/emailService";

const router = express.Router();

router.post("/", uploadToS3.single('image'), async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }

    console.log('📸 Image file received:', req.file ? 'Yes' : 'No');
    
    let imageUrl = '';
    if (req.file) {
      console.log('⬆️ Uploading to S3...');
      imageUrl = await uploadFileToS3(req.file);
      console.log('✅ S3 URL:', imageUrl);
    }

    const generatedPassword = generatePassword(6);
    
    const userData = {
      ...req.body,
      password: generatedPassword,
      ...(imageUrl && { image: imageUrl })
    };

    console.log('💾 Saving user with auto-generated password');
    const user = await User.create(userData);
    console.log('✅ User saved with ID:', user._id);
    
    try {
      await sendPasswordEmail(user.email, user.firstName, generatedPassword);
      console.log('📧 Password email sent to:', user.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send email:', emailError);
    }
    
    res.json(user);
  } catch (error) {
    console.error('❌ Error creating user:', error);
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

router.patch("/:id", authenticateToken, uploadToS3.single('image'), async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    
    const updateData = { ...req.body };
    
    if (req.file) {
      const imageUrl = await uploadFileToS3(req.file);
      updateData.image = imageUrl;
    }
    
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
