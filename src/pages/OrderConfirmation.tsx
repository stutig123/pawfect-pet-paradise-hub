
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import ordersData from "@/lib/data/orders.json";
import { Order, OrderStatus, CartItem } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const [order, setOrder] = useState<Order | null>(null);
  const { clearCart } = useCart();
  
  useEffect(() => {
    // Redirect if no order ID in state
    if (!orderId) {
      navigate("/", { replace: true });
      return;
    }
    
    // Find the order in the orders data
    const foundOrder = ordersData.find(o => o.id === orderId);
    if (foundOrder) {
      // Update order status to processing since payment was successful
      const orderIndex = ordersData.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        // Create properly typed order object
        const typedOrder: Order = {
          ...ordersData[orderIndex],
          status: "processing" as OrderStatus,
          items: ordersData[orderIndex].items.map(item => ({
            ...item,
            type: item.type as "product" | "pet"
          })) as CartItem[],
          updatedAt: new Date().toISOString()
        };
        
        // Update the order in the data array
        ordersData[orderIndex] = typedOrder;
        setOrder(typedOrder);
        console.log("Order status updated to processing:", typedOrder);
        
        // Clear the cart after successful order
        clearCart();
      } else {
        // If we can't find the order index (shouldn't happen), still show the found order
        setOrder({
          ...foundOrder,
          items: foundOrder.items.map(item => ({
            ...item,
            type: item.type as "product" | "pet"
          })) as CartItem[],
          status: foundOrder.status as OrderStatus
        });
      }
    }
  }, [orderId, navigate, clearCart]);

  if (!orderId) return null;

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 max-w-md">
        <Card className="border-green-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-6">
              <CheckIcon className="text-green-600 w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-display font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Order ID</span>
                <span className="font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              {order && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-medium">₹{order.total.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            {order && order.items && order.items.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h2 className="font-medium mb-2">Order Summary</h2>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-6">
              You'll receive a confirmation email with details of your order shortly.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full bg-pet-purple hover:bg-pet-darkPurple"
              asChild
            >
              <Link to="/dashboard">View My Orders</Link>
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              asChild
            >
              <Link to="/">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
