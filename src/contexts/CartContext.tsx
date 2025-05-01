
import React, { createContext, useContext, useEffect, useState } from "react";
import { Cart, CartItem } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
  });
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("petstore-cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse stored cart:", error);
        localStorage.removeItem("petstore-cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("petstore-cart", JSON.stringify(cart));
  }, [cart]);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const addToCart = (newItem: Omit<CartItem, "id">) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.itemId === newItem.itemId && item.type === newItem.type
      );

      let updatedItems;

      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        updatedItems = prevCart.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + newItem.quantity,
            };
          }
          return item;
        });
      } else {
        // Add new item with a unique ID
        const itemWithId = {
          ...newItem,
          id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        };
        updatedItems = [...prevCart.items, itemWithId];
      }

      const updatedCart = {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };

      toast({
        title: "Added to Cart",
        description: `${newItem.name} has been added to your cart.`,
        duration: 2000,
      });

      return updatedCart;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item.id !== itemId);
      
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity };
        }
        return item;
      });

      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      total: 0,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
