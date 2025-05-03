import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AdoptionRequest, AdoptionStatus, Pet, PetCategory, PetStatus, Product, User } from "@/lib/types";
import petsData from "@/lib/data/pets.json";
import productsData from "@/lib/data/products.json";
import adoptionRequestsData from "@/lib/data/adoption_requests.json";
import usersData from "@/lib/data/users.json";
import ordersData from "@/lib/data/orders.json";
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "pets" | "products" | "adoptions" | "orders">("dashboard");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAdoption, setCurrentAdoption] = useState<AdoptionRequest | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger
  const [localAdoptionRequests, setLocalAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [localOrders, setLocalOrders] = useState<any[]>([]);
  const { toast } = useToast();

  // Load data on component mount and when refresh is triggered
  useEffect(() => {
    // Make copies of the data to ensure reactivity
    // Cast the adoption requests to the correct type
    const typedAdoptionRequests = adoptionRequestsData.map(adoption => ({
      ...adoption,
      status: adoption.status as AdoptionStatus
    }));
    
    // Cast users to the correct type
    const typedUsers = usersData.map(user => ({
      ...user,
      role: user.role as "admin" | "user"
    }));
    
    setLocalAdoptionRequests(typedAdoptionRequests);
    setLocalUsers(typedUsers);
    setLocalOrders([...ordersData]);
    
    console.log("Admin Dashboard: Data refreshed", {
      adoptions: adoptionRequestsData.length,
      users: usersData.length,
      orders: ordersData.length
    });
  }, [refreshTrigger]);

  // Redirect if not authenticated or not an admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated."
    });
  };

  const handleApproveAdoption = (adoptionId: string) => {
    // Find the adoption request
    const adoptionIndex = adoptionRequestsData.findIndex(a => a.id === adoptionId);
    if (adoptionIndex !== -1) {
      // Update the status to approved
      adoptionRequestsData[adoptionIndex].status = "approved";
      adoptionRequestsData[adoptionIndex].updatedAt = new Date().toISOString();
      
      // Also update the pet status to adopted
      const petId = adoptionRequestsData[adoptionIndex].petId;
      const petIndex = petsData.findIndex(p => p.id === petId);
      if (petIndex !== -1) {
        petsData[petIndex].status = "adopted";
      }

      // Update local state with properly typed data
      const typedAdoptionRequests = adoptionRequestsData.map(adoption => ({
        ...adoption,
        status: adoption.status as AdoptionStatus
      }));
      setLocalAdoptionRequests(typedAdoptionRequests);
      
      // Update the adoption_requests.json file by updating localAdoptionRequests
      console.log("Approved adoption:", adoptionId);
      console.log("Updated adoption requests:", adoptionRequestsData);
    }
    
    toast({
      title: "Adoption Approved",
      description: "The adoption request has been approved.",
    });
    setDialogOpen(false);
    
    // Refresh data to ensure all components are updated
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRejectAdoption = (adoptionId: string) => {
    // Find the adoption request
    const adoptionIndex = adoptionRequestsData.findIndex(a => a.id === adoptionId);
    if (adoptionIndex !== -1) {
      // Update the status to rejected
      adoptionRequestsData[adoptionIndex].status = "rejected";
      adoptionRequestsData[adoptionIndex].updatedAt = new Date().toISOString();
      
      // Update local state with properly typed data
      const typedAdoptionRequests = adoptionRequestsData.map(adoption => ({
        ...adoption,
        status: adoption.status as AdoptionStatus
      }));
      setLocalAdoptionRequests(typedAdoptionRequests);
      
      // Log the updates for debugging
      console.log("Rejected adoption:", adoptionId);
      console.log("Updated adoption requests:", adoptionRequestsData);
    }
    
    toast({
      title: "Adoption Rejected",
      description: "The adoption request has been rejected.",
    });
    setDialogOpen(false);
    
    // Refresh data to ensure all components are updated
    setRefreshTrigger(prev => prev + 1);
  };

  const viewAdoptionDetails = (adoption: AdoptionRequest) => {
    setCurrentAdoption(adoption);
    setDialogOpen(true);
  };

  // Find pet details for an adoption request
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

  // Find user details with proper error handling
  const getUserDetails = (userId: string) => {
    const foundUser = localUsers.find(u => u.id === userId);
    if (foundUser) {
      return foundUser;
    }
    
    // If not found in local state, try finding in usersData
    const userData = usersData.find(u => u.id === userId);
    if (userData) {
      return { 
        ...userData, 
        role: userData.role as "admin" | "user" 
      };
    }
    
    // If still not found, return default values
    return { 
      id: "unknown", 
      name: "Unknown User", 
      email: "unknown@example.com", 
      password: "", 
      role: "user" as const,
      createdAt: new Date().toISOString()
    };
  };

  const updateOrderStatus = (orderId: string, newStatus: "processing" | "delivered" | "cancelled") => {
    // In a real app, this would update the database
    const orderIndex = ordersData.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      ordersData[orderIndex].status = newStatus;
      ordersData[orderIndex].updatedAt = new Date().toISOString();
      
      // Update local state
      setLocalOrders([...ordersData]);
      
      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}.`,
      });
      
      // Refresh the data after updating
      setRefreshTrigger(prev => prev + 1);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-display font-bold">Admin Dashboard</h1>
          <Button onClick={refreshData} variant="outline" className="flex items-center gap-2">
            Refresh Data
          </Button>
        </div>
        
        {/* Admin Navigation */}
        <div className="flex overflow-x-auto mb-6 gap-2 pb-2">
          <Button 
            variant={activeTab === "dashboard" ? "default" : "outline"} 
            onClick={() => setActiveTab("dashboard")}
            className="whitespace-nowrap"
          >
            Dashboard
          </Button>
          <Button 
            variant={activeTab === "users" ? "default" : "outline"} 
            onClick={() => setActiveTab("users")}
            className="whitespace-nowrap"
          >
            Users
          </Button>
          <Button 
            variant={activeTab === "pets" ? "default" : "outline"} 
            onClick={() => setActiveTab("pets")}
            className="whitespace-nowrap"
          >
            Pets
          </Button>
          <Button 
            variant={activeTab === "products" ? "default" : "outline"} 
            onClick={() => setActiveTab("products")}
            className="whitespace-nowrap"
          >
            Products
          </Button>
          <Button 
            variant={activeTab === "adoptions" ? "default" : "outline"} 
            onClick={() => setActiveTab("adoptions")}
            className="whitespace-nowrap"
          >
            Adoption Requests
          </Button>
          <Button 
            variant={activeTab === "orders" ? "default" : "outline"} 
            onClick={() => setActiveTab("orders")}
            className="whitespace-nowrap"
          >
            Orders
          </Button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-display">Pet Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Manage adoptable pets in the system.</p>
                <p className="text-sm text-gray-500">{petsData.length} pets available</p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => setActiveTab("pets")}
                >
                  Manage Pets
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-display">Product Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Update product stock and details.</p>
                <p className="text-sm text-gray-500">{productsData.length} products in inventory</p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => setActiveTab("products")}
                >
                  Manage Products
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-display">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Manage user accounts and permissions.</p>
                <p className="text-sm text-gray-500">{localUsers.length} registered users</p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => setActiveTab("users")}
                >
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-display">Orders Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Manage customer orders.</p>
                <p className="text-sm text-gray-500">{localOrders.length} orders placed</p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => setActiveTab("orders")}
                >
                  Manage Orders
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-display">Adoption Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Review and manage adoption requests.</p>
                <p className="text-sm text-gray-500">{localAdoptionRequests.filter(a => a.status === 'pending').length} pending requests</p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => setActiveTab("adoptions")}
                >
                  Review Requests
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pets Tab */}
        {activeTab === "pets" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display">Pet Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button>Add New Pet</Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Breed</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {petsData.map((pet) => (
                      <TableRow key={pet.id}>
                        <TableCell className="font-medium">{pet.name}</TableCell>
                        <TableCell className="capitalize">{pet.category}</TableCell>
                        <TableCell>{pet.breed}</TableCell>
                        <TableCell>{pet.age} months</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            pet.status === "available" 
                              ? "bg-green-100 text-green-800" 
                              : pet.status === "adopted" 
                                ? "bg-purple-100 text-purple-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/pets/${pet.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display">Product Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button>Add New Product</Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productsData.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell>₹{product.price.toLocaleString()}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/products/${product.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display">Orders Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localOrders.length > 0 ? (
                      localOrders.map((order) => {
                        const customer = getUserDetails(order.userId);
                        
                        return (
                          <TableRow key={order.id}>
                            <TableCell>#{order.id.substring(4, 12)}</TableCell>
                            <TableCell>{customer ? customer.name : 'Unknown User'}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
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
                            <TableCell>
                              <div className="flex gap-2">
                                {order.status === "processing" && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => updateOrderStatus(order.id, "delivered")}
                                    >
                                      Mark Delivered
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                )}
                                {order.status === "delivered" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    disabled
                                  >
                                    Delivered
                                  </Button>
                                )}
                                {order.status === "cancelled" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    disabled
                                  >
                                    Cancelled
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                          No orders yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Adoption Requests Tab */}
        {activeTab === "adoptions" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-display">Adoption Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Pet</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localAdoptionRequests.length > 0 ? (
                      localAdoptionRequests.map((adoption) => {
                        const pet = getPetDetails(adoption.petId);
                        const requester = getUserDetails(adoption.userId);
                        
                        return (
                          <TableRow key={adoption.id}>
                            <TableCell>#{adoption.id.substring(0, 8)}</TableCell>
                            <TableCell>{pet.name} ({pet.category.charAt(0).toUpperCase() + pet.category.slice(1)})</TableCell>
                            <TableCell>{requester ? requester.name : 'Unknown User'}</TableCell>
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
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => viewAdoptionDetails(adoption)}
                              >
                                Review
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                          No adoption requests yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Adoption Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adoption Request Details</DialogTitle>
              <DialogDescription>
                Review the details of this adoption request and take appropriate action.
              </DialogDescription>
            </DialogHeader>
            
            {currentAdoption && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Pet Information</h3>
                  <p>{getPetDetails(currentAdoption.petId).name} ({getPetDetails(currentAdoption.petId).breed || 'Unknown breed'})</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Requester</h3>
                  <p>{getUserDetails(currentAdoption.userId).name || 'Unknown User'}</p>
                  <p className="text-sm text-gray-500">{getUserDetails(currentAdoption.userId).email || 'unknown@example.com'}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Request Reason</h3>
                  <p className="text-gray-700">{currentAdoption.requestReason}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      currentAdoption.status === "approved" 
                        ? "bg-green-100 text-green-800" 
                        : currentAdoption.status === "rejected" 
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {currentAdoption.status.charAt(0).toUpperCase() + currentAdoption.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            )}
            
            <DialogFooter className="gap-2">
              {currentAdoption && currentAdoption.status === "pending" && (
                <>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleRejectAdoption(currentAdoption.id)}
                  >
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApproveAdoption(currentAdoption.id)}
                  >
                    Approve
                  </Button>
                </>
              )}
              {(!currentAdoption || currentAdoption.status !== "pending") && (
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Admin;
