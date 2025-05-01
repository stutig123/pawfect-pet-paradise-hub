
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pet, PetCategory } from "@/lib/types";
import petsData from "@/lib/data/pets.json";

const PetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to get pet details
    setLoading(true);
    try {
      const foundPet = petsData.find((p) => p.id === id);
      
      if (foundPet) {
        // Cast to proper types
        const typedPet: Pet = {
          ...foundPet,
          category: foundPet.category as PetCategory,
          status: foundPet.status as Pet['status']
        };
        
        setPet(typedPet);
      }
    } catch (error) {
      console.error("Error fetching pet details:", error);
      toast({
        title: "Error",
        description: "Failed to load pet details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-2xl">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

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

  // Pet category emojis
  const petEmojis: Record<string, string> = {
    dog: "🐶",
    cat: "🐱",
    bird: "🐦",
    fish: "🐠",
    rabbit: "🐰",
    other: "🐾",
  };

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
                  <p className="text-gray-500">Breed</p>
                  <p className="font-medium">{pet.breed}</p>
                </div>
                <div>
                  <p className="text-gray-500">Age</p>
                  <p className="font-medium">{pet.age} months</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium capitalize">{pet.category}</p>
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

            <div className="flex gap-4 pt-4">
              <Button className="bg-pet-purple hover:bg-pet-darkPurple">
                Adopt Now
              </Button>
              <Button variant="outline" className="border-pet-purple text-pet-purple hover:bg-pet-purple/10">
                Contact Shelter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PetDetails;
