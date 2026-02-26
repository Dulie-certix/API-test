import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { Product } from "../models/Product";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
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

    const imageUrl = (result as any).secure_url;

    // Save to MongoDB if productId provided
    if (req.body.productId) {
      await Product.findByIdAndUpdate(req.body.productId, {
        thumbnail: imageUrl,
      });
    }

    res.json({ imageUrl, message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

export const createProductWithImage = async (req: Request, res: Response) => {
  try {
    const { name, price, description, category, brand, stock } = req.body;

    let imageUrl = "";
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
      imageUrl = (result as any).secure_url;
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      brand,
      stock,
      thumbnail: imageUrl,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};
