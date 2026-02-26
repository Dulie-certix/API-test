import toast from "react-hot-toast";
import {
  showSuccessNotification,
  showErrorNotification,
} from "../utils/browserNotifications";

interface UserData {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password?: string;
  image?: string;
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const saveUser = async (
  userData: FormData,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      body: userData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save user");
    }

    toast.success("User created successfully!");
    showSuccessNotification("User created successfully!");
    return { success: true, message: "User saved successfully" };
  } catch (error) {
    console.error("Error saving user:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save user";
    toast.error(message);
    showErrorNotification(message);
    return {
      success: false,
      message: message,
    };
  }
};

export const updateUser = async (
  id: string,
  userData: FormData,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "PATCH",
      credentials: "include",
      body: userData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update user");
    }

    toast.success("User updated successfully!");
    showSuccessNotification("User updated successfully!");
    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update user";
    toast.error(message);
    showErrorNotification(message);
    return {
      success: false,
      message: message,
    };
  }
};

export const deleteUser = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete user");
    }

    toast.success("User deleted successfully!");
    showSuccessNotification("User deleted successfully!");
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete user";
    toast.error(message);
    showErrorNotification(message);
    return {
      success: false,
      message: message,
    };
  }
};

export const getUserById = async (id: string): Promise<{ success: boolean; data?: UserData; message: string }> => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch user");
    }

    const user = await response.json();
    return { success: true, data: user, message: "User fetched successfully" };
  } catch (error) {
    console.error("Error fetching user:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch user";
    return {
      success: false,
      message: message,
    };
  }
};

export const getAllUsers = async (): Promise<{ success: boolean; data?: any[]; message: string }> => {
  try {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch users");
    }

    const users = await response.json();
    return { success: true, data: users, message: "Users fetched successfully" };
  } catch (error) {
    console.error("Error fetching users:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";
    return {
      success: false,
      message: message,
    };
  }
};


