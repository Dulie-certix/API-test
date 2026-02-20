import { useState, useEffect } from 'react';
import axios from 'axios';
import { authService } from '../services/authService';
import { AuthUser, LoginRequest } from '@/types/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Call the verify endpoint to validate the token server-side
        // The token is sent automatically in the HTTP-only cookie
        const response = await fetch("http://localhost:5000/api/auth/verify", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials.email, credentials.password);
      if (response && response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
        return response;
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
    // Clear authorization header
    delete axios.defaults.headers.common["Authorization"];
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };
};
