
// Auth types
export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Pet types
export type PetCategory = "dog" | "cat" | "bird" | "fish" | "rabbit" | "other";
export type PetStatus = "available" | "adopted" | "pending";

export interface Pet {
  id: string;
  name: string;
  category: PetCategory;
  breed: string;
  age: number; // in months
  price: number;
  description: string;
  imageUrl: string;
  status: PetStatus;
  addedAt: string;
}

// Product types
export type ProductCategory = "food" | "toy" | "accessory" | "medicine" | "grooming" | "other";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  addedAt: string;
}

// Cart types
export interface CartItem {
  id: string;
  type: "pet" | "product";
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Order types
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// Adoption request types
export type AdoptionStatus = "pending" | "approved" | "rejected";

export interface AdoptionRequest {
  id: string;
  userId: string;
  petId: string;
  status: AdoptionStatus;
  requestReason: string;
  createdAt: string;
  updatedAt: string;
}

// Contact types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
