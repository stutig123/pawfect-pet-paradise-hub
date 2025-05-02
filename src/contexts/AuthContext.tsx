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

  // Use a local copy of users that persists between rerenders
  const [localUsers, setLocalUsers] = useState<User[]>([]);

  useEffect(() => {
    // Initialize localUsers from the users.json file on mount
    // Cast each user's role to Role type to ensure type safety
    const typedUsers = users.map(user => ({
      ...user,
      role: user.role as Role
    }));
    
    setLocalUsers(typedUsers);
    
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

      // Search in the localUsers array instead of users from the import
      const user = localUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Store user in localStorage for persistence
      localStorage.setItem("petstore-user", JSON.stringify(user));

      setAuthState({
        isAuthenticated: true,
        user: user,
        isLoading: false,
        error: null,
      });
      
      return user;
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

      // Check if user already exists in localUsers
      const userExists = localUsers.some((u) => u.email === email);
      if (userExists) {
        throw new Error("User with this email already exists");
      }

      // Generate unique ID with timestamp to ensure uniqueness
      const uniqueId = `user-${Math.random().toString(36).substr(2, 9)}`;
      
      const newUser: User = {
        id: uniqueId,
        name,
        email,
        password,
        role: "user" as Role,
        createdAt: new Date().toISOString(),
      };

      // Add user to localUsers array
      const updatedUsers = [...localUsers, newUser];
      setLocalUsers(updatedUsers);

      // Store user in localStorage for persistence
      localStorage.setItem("petstore-user", JSON.stringify(newUser));

      setAuthState({
        isAuthenticated: true,
        user: newUser,
        isLoading: false,
        error: null,
      });
      
      console.log("New user registered:", newUser);
      console.log("Updated users list:", updatedUsers);
      
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
    // Update the user in the local state
    setAuthState((prev) => ({
      ...prev,
      user: updatedUser,
    }));

    // Update the user in localStorage
    localStorage.setItem("petstore-user", JSON.stringify(updatedUser));
    
    // Update the user in the localUsers array
    const updatedUsers = localUsers.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    setLocalUsers(updatedUsers);
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
