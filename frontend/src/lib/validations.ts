import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z.number().min(1, "Age must be at least 1").max(120, "Age must be less than 120"),
  gender: z.enum(["male", "female"], { required_error: "Please select a gender" }),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  brand: z.string().min(2, "Brand is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().min(0, "Stock cannot be negative"),
  discountPercentage: z.number().min(0).max(100).optional(),
  rating: z.number().min(0).max(5).optional(),
  thumbnail: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type UserFormData = z.infer<typeof userSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;