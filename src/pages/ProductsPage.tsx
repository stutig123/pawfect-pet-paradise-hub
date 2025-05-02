
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductCategory } from "@/lib/types";
import productsData from "@/lib/data/products.json";
import { useState, useEffect } from "react";

const ProductsPage = () => {
  const [filter, setFilter] = useState<ProductCategory | "all">("all");
  const [validProducts, setValidProducts] = useState(productsData);

  // Filter out products without valid images
  useEffect(() => {
    const checkImageValidity = async (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    const validateProducts = async () => {
      const validProductsList = [];
      
      for (const product of productsData) {
        if (product.imageUrl && product.imageUrl.trim() !== "") {
          // Basic validation - check if URL is not empty
          const isValid = await checkImageValidity(product.imageUrl);
          if (isValid) {
            validProductsList.push(product);
          }
        }
      }
      
      setValidProducts(validProductsList);
      console.log(`Filtered out ${productsData.length - validProductsList.length} products with invalid images`);
    };

    validateProducts();
  }, []);

  const filteredProducts = filter === "all" 
    ? validProducts 
    : validProducts.filter(product => product.category === filter);

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
      <div className="container mx-auto py-10 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Pet Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our selection of high-quality pet products for your furry, feathery, or scaly friends.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Products
          </Button>
          <Button
            variant={filter === "food" ? "default" : "outline"}
            onClick={() => setFilter("food")}
          >
            🦴 Food
          </Button>
          <Button
            variant={filter === "toy" ? "default" : "outline"}
            onClick={() => setFilter("toy")}
          >
            🧸 Toys
          </Button>
          <Button
            variant={filter === "accessory" ? "default" : "outline"}
            onClick={() => setFilter("accessory")}
          >
            🎀 Accessories
          </Button>
          <Button
            variant={filter === "medicine" ? "default" : "outline"}
            onClick={() => setFilter("medicine")}
          >
            💊 Medicine
          </Button>
          <Button
            variant={filter === "grooming" ? "default" : "outline"}
            onClick={() => setFilter("grooming")}
          >
            ✂️ Grooming
          </Button>
          <Button
            variant={filter === "other" ? "default" : "outline"}
            onClick={() => setFilter("other")}
          >
            📦 Others
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    // Backup error handler in case the filtering missed something
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg">{product.name}</h3>
                  <span className="text-2xl">{productEmojis[product.category as string] || "📦"}</span>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500 capitalize">
                    <span className="font-medium">Category:</span> {product.category}
                  </p>
                  <p className="font-medium text-pet-purple mt-2">
                    ₹{product.price.toLocaleString()}
                  </p>
                  <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-pet-purple hover:bg-pet-darkPurple" disabled={product.stock <= 0}>
                  <Link to={`/products/${product.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No products found in this category.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setFilter("all")}
              >
                View All Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
