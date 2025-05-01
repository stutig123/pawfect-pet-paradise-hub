
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pet, PetCategory } from "@/lib/types";
import petsData from "@/lib/data/pets.json";
import { useState } from "react";

const PetsPage = () => {
  const [filter, setFilter] = useState<PetCategory | "all">("all");

  const filteredPets = filter === "all" 
    ? petsData 
    : petsData.filter(pet => pet.category === filter);

  // Pet category emojis
  const petEmojis: Record<string, string> = {
    dog: "🐕",
    cat: "🐈",
    bird: "🐦",
    fish: "🐠",
    rabbit: "🐇",
    other: "🐾",
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Our Adorable Pets
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our selection of lovable pets waiting for their forever homes.
            Each one has been carefully cared for and is ready for adoption.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Pets
          </Button>
          <Button
            variant={filter === "dog" ? "default" : "outline"}
            onClick={() => setFilter("dog")}
          >
            🐕 Dogs
          </Button>
          <Button
            variant={filter === "cat" ? "default" : "outline"}
            onClick={() => setFilter("cat")}
          >
            🐈 Cats
          </Button>
          <Button
            variant={filter === "bird" ? "default" : "outline"}
            onClick={() => setFilter("bird")}
          >
            🐦 Birds
          </Button>
          <Button
            variant={filter === "fish" ? "default" : "outline"}
            onClick={() => setFilter("fish")}
          >
            🐠 Fish
          </Button>
          <Button
            variant={filter === "rabbit" ? "default" : "outline"}
            onClick={() => setFilter("rabbit")}
          >
            🐇 Rabbits
          </Button>
          <Button
            variant={filter === "other" ? "default" : "outline"}
            onClick={() => setFilter("other")}
          >
            🐾 Others
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-square overflow-hidden">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg">{pet.name}</h3>
                  <span className="text-2xl">{petEmojis[pet.category as string] || "🐾"}</span>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Breed:</span> {pet.breed}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Age:</span> {pet.age} months
                  </p>
                  <p className="font-medium text-pet-purple mt-2">
                    ₹{pet.price.toLocaleString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-pet-purple hover:bg-pet-darkPurple">
                  <Link to={`/pets/${pet.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {filteredPets.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No pets found in this category.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setFilter("all")}
              >
                View All Pets
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PetsPage;
