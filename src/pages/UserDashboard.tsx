
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Order, AdoptionRequest, AdoptionStatus } from "@/lib/types";
import ordersData from "@/lib/data/orders.json";
import adoptionRequestsData from "@/lib/data/adoption_requests.json";
import petsData from "@/lib/data/pets.json";

const UserDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userAdoptions, setUserAdoptions] = useState<AdoptionRequest[]>([]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Filter orders and adoption requests for this user
    if (user) {
      const orders = ordersData.filter(order => order.userId === user.id);
      setUserOrders(orders);

      const adoptions = adoptionRequestsData
        .filter(adoption => adoption.userId === user.id)
        .map(adoption => ({
          ...adoption,
          status: adoption.status as AdoptionStatus
        }));
      setUserAdoptions(adoptions);
    }
  }, [isAuthenticated, user, navigate]);

  // Get pet name by ID
  const getPetName = (petId: string): string => {
    const pet = petsData.find(p => p.id === petId);
    return pet ? pet.name : "Unknown Pet";
  };

  if (!isAuthenticated || !user) {
    return null; // This will be handled by the useEffect redirect
  }

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">My Dashboard</h1>
        
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>My Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <p className="text-gray-500">Name:</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <p className="text-gray-500">Email:</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <p className="text-gray-500">Member since:</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="adoptions">Adoption Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {userOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{order.items.length} items</TableCell>
                            <TableCell>₹{order.total.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === "delivered" 
                                  ? "bg-green-100 text-green-800" 
                                  : order.status === "cancelled" 
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                    <Button asChild>
                      <a href="/products">Browse Products</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="adoptions">
            <Card>
              <CardHeader>
                <CardTitle>Adoption Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {userAdoptions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Request ID</TableHead>
                          <TableHead>Pet</TableHead>
                          <TableHead>Request Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userAdoptions.map((adoption) => (
                          <TableRow key={adoption.id}>
                            <TableCell className="font-medium">#{adoption.id.substring(0, 8)}</TableCell>
                            <TableCell>{getPetName(adoption.petId)}</TableCell>
                            <TableCell>{new Date(adoption.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                adoption.status === "approved" 
                                  ? "bg-green-100 text-green-800" 
                                  : adoption.status === "rejected" 
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {adoption.status.charAt(0).toUpperCase() + adoption.status.slice(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't requested to adopt any pets yet.</p>
                    <Button asChild>
                      <a href="/pets">Browse Pets</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserDashboard;
