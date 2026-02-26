export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: "admin" | "user";
  age?: number;
  gender?: string;
  phone?: string;
  username?: string;
}

export interface AuthUser extends User {
  // Additional fields specific to authenticated user
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  phone: string;
  username: string;
  role?: "admin" | "user";
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}
