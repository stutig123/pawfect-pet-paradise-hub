
import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  
  // Redirect if no order ID in state
  useEffect(() => {
    if (!orderId) {
      navigate("/", { replace: true });
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 text-center max-w-md">
        <Card className="border-green-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-6">
              <CheckIcon className="text-green-600 w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-display font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md mb-4 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Order ID</span>
                <span className="font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              You'll receive a confirmation email with details of your order shortly.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full bg-pet-purple hover:bg-pet-darkPurple"
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
