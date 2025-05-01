
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Product, ProductCategory } from "@/lib/types";
import productsData from "@/lib/data/products.json";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to get product details
    setLoading(true);
    try {
      const foundProduct = productsData.find((p) => p.id === id);
      
      if (foundProduct) {
        // Cast to proper types
        const typedProduct: Product = {
          ...foundProduct,
          category: foundProduct.category as ProductCategory
        };
        
        setProduct(typedProduct);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
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

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto py-20 px-4 text-center">
          <div className="text-7xl mb-6">📦</div>
          <h1 className="text-4xl font-display font-bold mb-4">Product Not Found</h1>
          <p className="text-xl mb-8 max-w-lg mx-auto">
            We couldn't find the product you're looking for. Please check the ID and try again.
          </p>
        </div>
      </Layout>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto object-cover aspect-square" 
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-display font-bold">{product.name}</h1>
              <span className="text-3xl">{productEmojis[product.category] || "📦"}</span>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium capitalize">{product.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Stock</p>
                  <p className="font-medium">{product.stock} available</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-display font-bold mb-2">About this product</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="pt-4">
              <h2 className="text-xl font-display font-bold mb-4">Price</h2>
              <p className="text-2xl font-bold text-pet-purple">₹{product.price.toLocaleString()}</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="bg-pet-purple hover:bg-pet-darkPurple">
                Add to Cart
              </Button>
              <Button variant="outline" className="border-pet-purple text-pet-purple hover:bg-pet-purple/10">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
