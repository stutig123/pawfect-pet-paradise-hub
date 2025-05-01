
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const AdoptionPage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Pet Adoption
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find your new best friend and give them a forever home. Our adoption process is designed to ensure the best match for both you and your pet.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div>
            <h2 className="text-2xl font-display font-bold mb-4">Why Adopt?</h2>
            <div className="space-y-4">
              <p>
                When you adopt, you save a life. Every pet deserves a loving home, and by adopting, you're making space for another animal in need.
              </p>
              <p>
                You'll gain a loyal companion who will give you unconditional love. Whether it's a dog, cat, bird, or other pet, they each bring their unique personality and joy to your home.
              </p>
              <p>
                Our adoption fees are much lower than buying from breeders, and all pets are checked by veterinarians, vaccinated, and often already spayed/neutered.
              </p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGV0JTIwYWRvcHRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
              alt="Happy dog and owner after adoption"
              className="w-full h-full object-cover aspect-square md:aspect-auto md:h-full"
            />
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-display font-bold mb-6 text-center">Our Adoption Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">1. Find Your Pet</h3>
              <CardContent className="p-0">
                <p className="text-gray-600">
                  Browse our available pets and find one that matches your lifestyle and preferences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">2. Submit Request</h3>
              <CardContent className="p-0">
                <p className="text-gray-600">
                  Fill out an adoption request form with information about your home and experience with pets.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-bold mb-2">3. Welcome Home</h3>
              <CardContent className="p-0">
                <p className="text-gray-600">
                  After approval, complete the adoption fee payment and welcome your new pet home!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h2 className="text-2xl font-display font-bold mb-6">Ready to Adopt?</h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-8">
            Browse our available pets and find your perfect companion today. Each animal has been cared for and is ready to join their new forever home.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-pet-purple hover:bg-pet-darkPurple">
              <Link to="/pets">Browse Adoptable Pets</Link>
            </Button>
            
            {isAuthenticated ? (
              <Button asChild variant="outline" className="border-pet-purple text-pet-purple hover:bg-pet-purple/10">
                <Link to="/dashboard">View My Adoption Requests</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="border-pet-purple text-pet-purple hover:bg-pet-purple/10">
                <Link to="/login">Login to Adopt</Link>
              </Button>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Adoption Requirements</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Valid government-issued ID</li>
            <li>Proof of residence</li>
            <li>If renting, landlord's approval for pets</li>
            <li>Adoption fees vary by animal type and age</li>
            <li>All household members should agree to the adoption</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default AdoptionPage;
