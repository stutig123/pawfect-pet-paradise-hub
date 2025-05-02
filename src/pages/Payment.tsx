
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, Truck, CreditCardIcon } from "lucide-react";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const orderDetails = location.state?.orderDetails;
  
  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCVV] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");

  useEffect(() => {
    // Redirect if not authenticated or no order details
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    
    if (!orderDetails) {
      navigate("/checkout", { replace: true });
      return;
    }
  }, [isAuthenticated, orderDetails, navigate]);

  const formatCardNumber = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add spaces after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (paymentMethod === "card") {
      // Validate card form fields
      if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
        toast({
          title: "Error",
          description: "Please fill out all card details",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
    }
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Payment Successful!",
        description: paymentMethod === "card" 
          ? "Your card payment has been processed successfully." 
          : "Your order has been placed successfully with cash on delivery."
      });
      
      // Navigate to order confirmation with the order ID
      navigate("/order-confirmation", { 
        state: { orderId: orderDetails.orderId },
        replace: true 
      });
    }, 1500);
  };

  if (!orderDetails) return null;

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">Payment Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl mb-2">Payment Method</CardTitle>
                <RadioGroup 
                  defaultValue="card" 
                  className="flex flex-col space-y-2"
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as "card" | "cod")}
                >
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCardIcon className="h-4 w-4" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                      <Truck className="h-4 w-4" />
                      <span>Cash on Delivery</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardHeader>
              <CardContent>
                {paymentMethod === "card" ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input 
                        id="nameOnCard"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input 
                          id="expiryDate"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv"
                          value={cvv}
                          onChange={(e) => setCVV(e.target.value.replace(/\D/g, '').substring(0, 3))}
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full bg-pet-purple hover:bg-pet-darkPurple mt-4"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Pay Now"}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="border-t border-b py-4">
                      <h3 className="font-medium mb-2">Cash on Delivery Details</h3>
                      <p className="text-sm text-gray-600">
                        You'll pay the full amount to the delivery person when your order arrives at your doorstep.
                      </p>
                    </div>
                    <Button 
                      onClick={handleSubmit}
                      className="w-full bg-pet-purple hover:bg-pet-darkPurple"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{orderDetails.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{orderDetails.taxes?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{orderDetails.shipping?.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{orderDetails.total?.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
