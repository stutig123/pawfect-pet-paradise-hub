import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";

// Import sample data
import petsData from "@/lib/data/pets.json";
import productsData from "@/lib/data/products.json";
import { Pet, Product, PetCategory, ProductCategory } from "@/lib/types";

const Index = () => {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Cast the imported JSON data to the proper types
    const typedPets = petsData.map(pet => ({
      ...pet,
      category: pet.category as PetCategory,
      status: pet.status as Pet['status']
    })) as Pet[];
    
    const typedProducts = productsData.map(product => ({
      ...product,
      category: product.category as ProductCategory
    })) as Product[];
    
    // Simulate getting featured items
    setFeaturedPets(typedPets.slice(0, 3));
    setFeaturedProducts(typedProducts.slice(0, 3));
  }, []);

  // Pet category emojis
  const petEmojis: Record<string, string> = {
    dog: "🐶",
    cat: "🐱",
    bird: "🐦",
    fish: "🐠",
    rabbit: "🐰",
    other: "🐾",
  };

  // Product category emojis
  const productEmojis: Record<string, string> = {
    food: "🦴",
    toy: "🧸",
    accessory: "🎀",
    medicine: "💊",
    grooming: "✂️",
    other: "📦",
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pet-blue to-pet-purple/20 py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 animate-fade-in">
              Welcome to <span className="text-pet-purple">PawfectPets</span>
              <span className="text-3xl ml-2">🐾</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Your one-stop shop for all pet needs. Buy, adopt, and care for your
              furry friends with our premium products and services.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/pets">
                <Button className="bg-pet-purple hover:bg-pet-darkPurple text-white px-8 py-6 rounded-lg text-lg">
                  Adopt a Pet
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="border-pet-purple text-pet-purple hover:bg-pet-purple/10 px-8 py-6 rounded-lg text-lg">
                  Shop Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="hidden md:block absolute top-10 right-10 text-7xl animate-bounce-in" style={{ animationDelay: "0.3s" }}>🐶</div>
        <div className="hidden md:block absolute bottom-10 right-32 text-6xl animate-bounce-in" style={{ animationDelay: "0.4s" }}>🐱</div>
        <div className="hidden md:block absolute top-1/2 right-1/4 text-5xl animate-bounce-in" style={{ animationDelay: "0.5s" }}>🐰</div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Why Choose PawfectPets?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-xl font-display font-bold mb-2">Pet Adoption</h3>
              <p className="text-gray-600">
                Find your perfect furry companion. We have a wide range of pets looking for loving homes.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🛍️</div>
              <h3 className="text-xl font-display font-bold mb-2">Premium Products</h3>
              <p className="text-gray-600">
                Shop high-quality pet food, toys, and accessories at competitive prices.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">💖</div>
              <h3 className="text-xl font-display font-bold mb-2">Expert Care</h3>
              <p className="text-gray-600">
                Get advice from our pet experts to ensure your pets live their happiest, healthiest lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-8">Featured Pets & Products</h2>
          
          <Tabs defaultValue="pets" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="pets" className="text-lg px-6">Pets 🐾</TabsTrigger>
                <TabsTrigger value="products" className="text-lg px-6">Products 🦴</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="pets" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPets.map((pet) => (
                  <Link to={`/pets/${pet.id}`} key={pet.id}>
                    <Card className="overflow-hidden pet-card h-full">
                      <div className="aspect-w-16 aspect-h-9 relative h-48">
                        <img 
                          src={pet.imageUrl} 
                          alt={pet.name} 
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-3 right-3 bg-pet-purple text-white rounded-full w-10 h-10 flex items-center justify-center text-xl">
                          {petEmojis[pet.category] || "🐾"}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-display font-bold text-lg">{pet.name}</h3>
                          <span className="text-pet-purple font-bold">₹{pet.price.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{pet.breed} • {pet.age} months</p>
                        <p className="line-clamp-2 text-gray-700 text-sm">{pet.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/pets">
                  <Button variant="outline" className="border-pet-purple text-pet-purple hover:bg-pet-purple/10">
                    View All Pets
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <Link to={`/products/${product.id}`} key={product.id}>
                    <Card className="overflow-hidden product-card h-full">
                      <div className="aspect-w-16 aspect-h-9 relative h-48">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="object-cover w-full h-full" 
                        />
                        <div className="absolute top-3 right-3 bg-pet-purple text-white rounded-full w-10 h-10 flex items-center justify-center text-xl">
                          {productEmojis[product.category] || "📦"}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-display font-bold text-lg">{product.name}</h3>
                          <span className="text-pet-purple font-bold">₹{product.price.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                        <p className="line-clamp-2 text-gray-700 text-sm">{product.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/products">
                  <Button variant="outline" className="border-pet-purple text-pet-purple hover:bg-pet-purple/10">
                    View All Products
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-pet-yellow/50 to-pet-green/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-6">Ready to Welcome a Pet into Your Home?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're looking to adopt a new friend or need supplies for your current companions, we're here to help make your pet parenting journey easier.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/adoption">
              <Button className="bg-pet-purple hover:bg-pet-darkPurple text-white px-8 py-2 rounded-lg">
                Start Adoption Process
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-pet-purple text-pet-purple hover:bg-pet-purple/10 px-8 py-2 rounded-lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
