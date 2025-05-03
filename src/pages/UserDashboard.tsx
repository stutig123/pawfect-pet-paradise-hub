
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Order, AdoptionRequest, AdoptionStatus, PetCategory, Pet, PetStatus } from "@/lib/types";
import ordersData from "@/lib/data/orders.json";
import adoptionRequestsData from "@/lib/data/adoption_requests.json";
import petsData from "@/lib/data/pets.json";
import { useToast } from "@/components/ui/use-toast";

const UserDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userAdoptions, setUserAdoptions] = useState<AdoptionRequest[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // To trigger refreshes
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Set loading state
    setLoading(true);
    
    // Filter orders and adoption requests for this user
    if (user) {
      console.log("Loading user data for:", user.id);
      
      // Filter orders for this user
      const filteredOrders = ordersData
        .filter(order => order.userId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Most recent first
        .map(order => ({
          ...order,
          status: order.status as "pending" | "processing" | "delivered" | "cancelled"
        }));
      setUserOrders(filteredOrders);
      
      console.log("Available adoption requests:", adoptionRequestsData);
      console.log("User ID to filter by:", user.id);

      // Filter adoption requests for this user and ensure they have the correct typing
      const filteredAdoptions = adoptionRequestsData
        .filter(adoption => adoption.userId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Most recent first
        .map(adoption => ({
          ...adoption,
          status: adoption.status as AdoptionStatus
        }));
      setUserAdoptions(filteredAdoptions);
      
      console.log("User data loaded:", { 
        user, 
        orders: filteredOrders.length,
        adoptions: filteredAdoptions.length,
        adoptionsData: filteredAdoptions
      });
      
      // End loading state
      setLoading(false);
    }
  }, [isAuthenticated, user, navigate, refreshTrigger]); // Added refreshTrigger

  // Function to manually refresh data
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated."
    });
  };

  // Get pet name by ID
  const getPetName = (petId: string): string => {
    const pet = petsData.find(p => p.id === petId);
    return pet ? pet.name : "Unknown Pet";
  };

  // Get pet details by ID
  const getPetDetails = (petId: string): Pet => {
    const pet = petsData.find(pet => pet.id === petId);
    if (pet) {
      return {
        ...pet,
        category: pet.category as PetCategory,
        status: pet.status as PetStatus
      };
    }
    return { 
      id: "unknown", 
      name: "Unknown Pet", 
      category: "other" as PetCategory,
      breed: "",
      age: 0,
      price: 0,
      description: "",
      imageUrl: "",
      status: "available" as PetStatus,
      addedAt: new Date().toISOString()
    };
  };

  if (!isAuthenticated || !user) {
    return null; // This will be handled by the useEffect redirect
  }

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-display font-bold">My Dashboard</h1>
          <Button onClick={refreshData} variant="outline" className="flex items-center gap-2">
            Refresh Data
          </Button>
        </div>
        
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
        
        {loading ? (
          <Card>
            <CardContent className="flex justify-center items-center py-8">
              <p>Loading your data...</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="orders">My Orders ({userOrders.length})</TabsTrigger>
              <TabsTrigger value="adoptions">Adoption Requests ({userAdoptions.length})</TabsTrigger>
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
                              <TableCell className="font-medium">#{order.id.substring(4, 12)}</TableCell>
                              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>{order.items.length} items</TableCell>
                              <TableCell>₹{order.total.toLocaleString()}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  order.status === "delivered" 
                                    ? "bg-green-100 text-green-800" 
                                    : order.status === "cancelled" 
                                      ? "bg-red-100 text-red-800"
                                      : order.status === "processing"
                                        ? "bg-blue-100 text-blue-800"
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
                          {userAdoptions.map((adoption) => {
                            const petDetails = getPetDetails(adoption.petId);
                            return (
                              <TableRow key={adoption.id}>
                                <TableCell className="font-medium">#{adoption.id.substring(0, 8)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {petDetails.imageUrl && (
                                      <img 
                                        src={petDetails.imageUrl} 
                                        alt={petDetails.name}
                                        className="w-8 h-8 object-cover rounded"
                                      />
                                    )}
                                    <span>{petDetails.name}</span>
                                  </div>
                                </TableCell>
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
                            );
                          })}
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
        )}
      </div>
    </Layout>
  );
};

export default UserDashboard;
