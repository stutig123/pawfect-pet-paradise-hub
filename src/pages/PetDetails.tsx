
import { useParams } from "react-router-dom";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Pet, PetCategory } from "@/lib/types";
import petsData from "@/lib/data/pets.json";

const PetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(() => {
    const foundPet = petsData.find((p) => p.id === id);
    if (foundPet) {
      return {
        ...foundPet,
        category: foundPet.category as PetCategory
      };
    }
    return null;
  });
  
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const [adoptDialogOpen, setAdoptDialogOpen] = useState(false);
  const [adoptionReason, setAdoptionReason] = useState("");

  if (!pet) {
    return (
      <Layout>
        <div className="container mx-auto py-20 px-4 text-center">
          <div className="text-7xl mb-6">🐾</div>
          <h1 className="text-4xl font-display font-bold mb-4">Pet Not Found</h1>
          <p className="text-xl mb-8 max-w-lg mx-auto">
            We couldn't find the pet you're looking for. Please check the ID and try again.
          </p>
        </div>
      </Layout>
    );
  }

  const handleAdoptSubmit = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit an adoption request",
        variant: "destructive",
      });
      return;
    }
    
    if (!adoptionReason.trim()) {
      toast({
        title: "Required Field",
        description: "Please provide a reason for your adoption request",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would save to a database
    const adoptionRequest = {
      id: `ADO-${Math.random().toString(36).substr(2, 9)}`,
      userId: user!.id,
      petId: pet.id,
      status: "pending" as const,
      requestReason: adoptionReason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log("Adoption request submitted:", adoptionRequest);

    toast({
      title: "Adoption Request Submitted",
      description: "We'll review your request and get back to you soon!",
    });

    setAdoptDialogOpen(false);
    setAdoptionReason("");
  };

  const handleAddToCart = () => {
    addToCart({
      type: "pet",
      itemId: pet.id,
      name: pet.name,
      price: pet.price,
      quantity: 1,
      imageUrl: pet.imageUrl
    });
  };

  // Pet category emojis
  const petEmojis: Record<string, string> = {
    dog: "🐕",
    cat: "🐈",
    bird: "🐦",
    fish: "🐠",
    rabbit: "🐇",
    other: "🐾",
  };

  // Conditionally show buy/adopt buttons only for regular users
  const showUserActions = isAuthenticated && user?.role !== "admin";

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pet Image */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={pet.imageUrl} 
              alt={pet.name} 
              className="w-full h-auto object-cover aspect-square" 
            />
          </div>

          {/* Pet Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-display font-bold">{pet.name}</h1>
              <span className="text-3xl">{petEmojis[pet.category] || "🐾"}</span>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium capitalize">{pet.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Breed</p>
                  <p className="font-medium">{pet.breed}</p>
                </div>
                <div>
                  <p className="text-gray-500">Age</p>
                  <p className="font-medium">{pet.age} months</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium capitalize">{pet.status}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-display font-bold mb-2">About {pet.name}</h2>
              <p className="text-gray-700">{pet.description}</p>
            </div>
            
            <div className="pt-4">
              <h2 className="text-xl font-display font-bold mb-4">Adoption Fee</h2>
              <p className="text-2xl font-bold text-pet-purple">₹{pet.price.toLocaleString()}</p>
            </div>

            {showUserActions && pet.status === "available" && (
              <div className="flex gap-4 pt-4">
                <Button 
                  className="bg-pet-purple hover:bg-pet-darkPurple"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="border-pet-purple text-pet-purple hover:bg-pet-purple/10"
                  onClick={() => setAdoptDialogOpen(true)}
                >
                  Request Adoption
                </Button>
              </div>
            )}
            
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 pt-2">
                You need to <a href="/login" className="text-pet-purple hover:underline">login</a> to adopt or purchase this pet.
              </p>
            )}
            
            {pet.status !== "available" && (
              <p className="text-sm text-amber-600 font-medium pt-2">
                This pet is currently not available for adoption.
              </p>
            )}
          </div>
        </div>

        {/* Adoption Request Dialog */}
        <Dialog open={adoptDialogOpen} onOpenChange={setAdoptDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request to Adopt {pet.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <p className="text-gray-700">
                Please tell us a little about why you'd like to adopt {pet.name} and your experience with pets.
              </p>
              
              <textarea
                value={adoptionReason}
                onChange={(e) => setAdoptionReason(e.target.value)}
                placeholder="I would like to adopt this pet because..."
                className="w-full rounded-md border p-3 h-32 resize-none"
              />
              
              <p className="text-sm text-gray-500">
                Your request will be reviewed by our team. We may contact you for additional information.
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAdoptDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdoptSubmit}>
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default PetDetails;
