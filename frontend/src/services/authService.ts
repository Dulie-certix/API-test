import { AuthUser } from '@/types/auth';
import { getTokenFromCookies } from '@/utils/cookies';

const API_BASE_URL = 'http://localhost:5000/api';

interface LoginResponse {
  token: string;
  user: AuthUser;
}

class AuthService {
  private userKey = 'user';

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    // Store user in localStorage (but not token - it's in HTTP-only cookie)
    this.setUser(data.user);
    return data;
  }

  async verifyToken(): Promise<AuthUser | null> {
    // Token is now in HTTP-only cookie, so we just call the verify endpoint
    // The browser will automatically send the cookie with the request
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        credentials: 'include',
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const data = await response.json();
      this.setUser(data.user);
      return data.user;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear user from localStorage
    localStorage.removeItem(this.userKey);
  }

  // Token is now handled by HTTP-only cookie, so we get it from cookies
  getToken(): string | null {
    return getTokenFromCookies();
  }

  getUser(): AuthUser | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    // Check if user exists in localStorage (token is in cookie)
    return this.getUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  private setUser(user: AuthUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getAuthHeaders(): Record<string, string> {
    // Token is in HTTP-only cookie, so we don't need to add Authorization header
    // But for backward compatibility, we can still get it from cookies
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
