import express from "express";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = express.Router();

// Get all users
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get all products (allow authenticated users to view products and copy IDs)
router.get("/products", authenticateToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Delete user
router.delete("/users/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Delete product
router.delete(
  "/products/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  },
);

export default router;
