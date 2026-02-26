import axios from "../lib/axios";
import toast from "react-hot-toast";
import { showSuccessNotification } from "../utils/browserNotifications";

const API_BASE_URL = "http://localhost:5000/api";

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  phone?: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  phone?: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  _id: string;
}

class UserService {
  private baseURL = `${API_BASE_URL}/users`;

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get<User[]>(this.baseURL);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const response = await axios.get<User>(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await axios.post<User>(this.baseURL, userData);
      toast.success("User created successfully!");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create user");
      throw error;
    }
  }

  async updateUser(userData: UpdateUserData): Promise<User> {
    try {
      const { _id, ...updateData } = userData;
      const response = await axios.patch<User>(
        `${this.baseURL}/${_id}`,
        updateData,
      );
      toast.success("User updated successfully!");
      showSuccessNotification("User updated successfully!");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user");
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/${id}`);
      toast.success("User deleted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
      throw error;
    }
  }
}

export const userService = new UserService();
