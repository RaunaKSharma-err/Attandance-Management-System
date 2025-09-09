import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, AuthContextType, RegisterData } from "../types";
import { authAPI, usersAPI } from "../services/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await usersAPI.getMe();
      const userData = response.data.user; // <- access the `user` property

      if (!userData.role) {
        console.error("User role is missing from API:", userData);
        logout();
        return;
      }

      setUser({
        ...userData,
        role: userData.role.toLowerCase() as "student" | "teacher" | "admin",
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      // If it's an Axios error, you can narrow further
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      throw new Error(axiosError.response?.data?.message || "Login failed");
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      await authAPI.register(userData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      // If it's an Axios error, you can narrow further
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      throw new Error(
        axiosError.response?.data?.message || "Registration failed"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
