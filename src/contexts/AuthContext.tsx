import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Role, AuthState } from "@/lib/types";
import users from "@/lib/data/users.json";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("petstore-user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("petstore-user");
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      // In a real app, this would be an API call
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Cast the user.role to Role type to ensure type safety
      const typedUser: User = {
        ...user,
        role: user.role as Role
      };

      // Store user in localStorage for persistence
      localStorage.setItem("petstore-user", JSON.stringify(typedUser));

      setAuthState({
        isAuthenticated: true,
        user: typedUser,
        isLoading: false,
        error: null,
      });
      
      return typedUser;
    } catch (error) {
      console.error("Login error:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }));
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Check if user already exists
      const userExists = users.some((u) => u.email === email);
      if (userExists) {
        throw new Error("User with this email already exists");
      }

      // In a real app, this would be an API call
      const newUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        password,
        role: "user" as Role, // Explicitly cast to Role type
        createdAt: new Date().toISOString(),
      };

      // Add user to users array (in real app, this would save to the server)
      users.push(newUser);

      // Store user in localStorage for persistence
      localStorage.setItem("petstore-user", JSON.stringify(newUser));

      setAuthState({
        isAuthenticated: true,
        user: newUser,
        isLoading: false,
        error: null,
      });
      
      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("petstore-user");
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    });
  };

  const updateUser = (updatedUser: User) => {
    setAuthState((prev) => ({
      ...prev,
      user: updatedUser,
    }));
    localStorage.setItem("petstore-user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
