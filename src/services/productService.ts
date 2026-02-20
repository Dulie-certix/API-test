import axios from "../libs/axios";
import toast from "react-hot-toast";
import {
  showSuccessNotification,
  showErrorNotification,
} from "../utils/browserNotifications";

const API_BASE_URL = "http://localhost:5000/api";

export interface Product {
  _id?: string;
  name: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  stock: number;
  discountPercentage?: number;
  rating?: number;
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
}

class ProductService {
  private baseURL = `${API_BASE_URL}/products`;

  async createProduct(
    product: Omit<Product, "_id" | "createdAt" | "updatedAt"> | FormData,
  ): Promise<Product> {
    try {
      const response = await axios.post<Product>(this.baseURL, product, {
        headers: product instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await axios.get<Product[]>(this.baseURL);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  async getProductById(id: string): Promise<{ success: boolean; data?: Product; message: string }> {
    try {
      const response = await axios.get<Product>(`${this.baseURL}/${id}`);
      return { success: true, data: response.data, message: "Product fetched successfully" };
    } catch (error) {
      console.error("Error fetching product:", error);
      const message = error instanceof Error ? error.message : "Failed to fetch product";
      return { success: false, message };
    }
  }

  async updateProduct(id: string, product: Partial<Product> | FormData): Promise<{ success: boolean; data?: Product; message: string }> {
    try {
      const response = await axios.patch<Product>(`${this.baseURL}/${id}`, product, {
        headers: product instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return { success: true, data: response.data, message: "Product updated successfully" };
    } catch (error) {
      console.error("Error updating product:", error);
      const message = error instanceof Error ? error.message : "Failed to update product";
      return { success: false, message };
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/${id}`);
      toast.success("Product deleted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete product");
      throw error;
    }
  }
}

export const productService = new ProductService();
