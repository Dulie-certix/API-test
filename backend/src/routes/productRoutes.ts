import dotenv from "dotenv";
// Load env first in this file
dotenv.config();

import express from "express";
import type { Request, Response } from "express";
import { Product } from "../models/Product";
import { authenticateToken, requireAdmin, AuthRequest } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with explicit values
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

console.log("ProductRoutes - Cloudinary Config:", {
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  api_secret: cloudinaryConfig.api_secret ? "***" + cloudinaryConfig.api_secret.slice(-4) : "NOT SET"
});

cloudinary.config(cloudinaryConfig);

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create - Admin only with image upload
router.post("/", requireAdmin, upload.single("thumbnail"), async (req: Request, res: Response) => {
  try {
    console.log("=== Product Create Request ===");
    console.log("User:", (req as any).user);
    console.log("File received:", req.file ? "Yes" : "No");
    console.log("Body:", req.body);
    
    let thumbnailUrl = "";
    
    // Upload to Cloudinary if file exists
    if (req.file) {
      console.log("Uploading to Cloudinary...");
      console.log("File size:", req.file.size);
      console.log("File type:", req.file.mimetype);
      
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("Cloudinary upload success:", result?.secure_url);
              resolve(result);
            }
          }
        );
        uploadStream.end(req.file!.buffer);
      });
      thumbnailUrl = (result as any).secure_url;
    } else {
      console.log("No file to upload");
    }

    const product = await Product.create({
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand,
      stock: Number(req.body.stock),
      discountPercentage: Number(req.body.discountPercentage) || 0,
      rating: Number(req.body.rating) || 0,
      thumbnail: thumbnailUrl || req.body.thumbnail || "",
    });
    
    console.log("Product created:", product._id);
    res.json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Read - All authenticated users
router.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get single product - All authenticated users
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update - Admin only with image upload
router.patch("/:id", requireAdmin, upload.single("thumbnail"), async (req: Request, res: Response) => {
  try {
    let updateData: any = {
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand,
      stock: Number(req.body.stock),
      discountPercentage: Number(req.body.discountPercentage) || 0,
      rating: Number(req.body.rating) || 0,
    };
    
    // Upload to Cloudinary if new file exists
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file!.buffer);
      });
      updateData.thumbnail = (result as any).secure_url;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete - Admin only
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
