import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Navigate, Link } from "react-router-dom";
import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdoptionRequest, AdoptionStatus, Pet, Product } from "@/lib/types";
import petsData from "@/lib/data/pets.json";
import productsData from "@/lib/data/products.json";
import adoptionRequestsData from "@/lib/data/adoption_requests.json";
import usersData from "@/lib/data/users.json";

const Admin = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "pets" | "products" | "adoptions">("dashboard");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAdoption, setCurrentAdoption] = useState<AdoptionRequest | null>(null);

  // Redirect if not authenticated or not an admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const handleApproveAdoption = (adoptionId: string) => {
    // In a real app, this would update the database
    console.log("Approved adoption:", adoptionId);
    setDialogOpen(false);
  };

  const handleRejectAdoption = (adoptionId: string) => {
    // In a real app, this would update the database
    console.log("Rejected adoption:", adoptionId);
    setDialogOpen(false);
  };

  const viewAdoptionDetails = (adoption: AdoptionRequest) => {
    setCurrentAdoption(adoption);
    setDialogOpen(true);
  };

  // Find pet details for an adoption request
  const getPetDetails = (petId: string) => {
    const pet = petsData.find(pet => pet.id === petId);
    if (pet) {
      return pet;
    }
    return { name: "Unknown Pet", category: "unknown" };
  };

  // Find user details
  const getUserDetails = (userId: string) => {
    return usersData.find(u => u.id === userId) || { name: "Unknown User", email: "unknown@example.com" };
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">Admin Dashboard</h1>
        
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
                <p className="text-sm text-gray-500">{usersData.length} registered users</p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => setActiveTab("users")}
                >
                  Manage Users
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
                    {usersData.map((user) => (
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
                    {adoptionRequestsData.length > 0 ? (
                      adoptionRequestsData.map((adoption) => {
                        const pet = getPetDetails(adoption.petId);
                        const requester = getUserDetails(adoption.userId);
                        
                        return (
                          <TableRow key={adoption.id}>
                            <TableCell>#{adoption.id.substring(0, 8)}</TableCell>
                            <TableCell>{pet.name} ({(pet.category as string).charAt(0).toUpperCase() + (pet.category as string).slice(1)})</TableCell>
                            <TableCell>{requester.name}</TableCell>
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
            </DialogHeader>
            
            {currentAdoption && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Pet Information</h3>
                  <p>{getPetDetails(currentAdoption.petId).name} ({getPetDetails(currentAdoption.petId).breed || 'Unknown breed'})</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Requester</h3>
                  <p>{getUserDetails(currentAdoption.userId).name}</p>
                  <p className="text-sm text-gray-500">{getUserDetails(currentAdoption.userId).email}</p>
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
