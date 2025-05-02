
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import ordersData from "@/lib/data/orders.json";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login", { replace: true });
    return null;
  }

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    navigate("/", { replace: true });
    return null;
  }

  const handleCheckout = () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Create an order object (in a real app, this would be saved to a database)
      const order = {
        id: `ORD-${Math.random().toString(36).substr(2, 9)}`,
        userId: user!.id,
        items: cart.items,
        total: cart.total,
        status: "processing",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // In a real application, this would be an API call to save the order
      // For now, we'll log it and update the orders.json
      console.log("Order created:", order);
      
      // Add the order to the orders array (in memory)
      ordersData.push(order);
      
      // Clear the cart
      clearCart();
      
      // Show success message
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });
      
      // Navigate to order confirmation
      navigate("/order-confirmation", { 
        state: { orderId: order.id },
        replace: true 
      });
    }, 1500);
  };

  // Calculate taxes, shipping, and total
  const subtotal = cart.total;
  const taxes = parseFloat((cart.total * 0.18).toFixed(2));
  const shipping = subtotal > 0 ? 100 : 0;
  const total = subtotal + taxes + shipping;

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-gray-500 text-xs capitalize">{item.type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>₹{item.price.toLocaleString()}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{(item.price * item.quantity).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          {/* Payment Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-pet-purple hover:bg-pet-darkPurple"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
