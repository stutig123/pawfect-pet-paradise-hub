
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Product, ProductCategory } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import productsData from "@/lib/data/products.json";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

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

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        type: "product",
        itemId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.imageUrl
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({
        type: "product",
        itemId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.imageUrl
      });
      
      // Navigate to checkout
      window.location.href = "/checkout";
    }
  };

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

  // Check if user is admin
  const isAdmin = isAuthenticated && user?.role === "admin";

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

            {!isAdmin && (
              <>
                <div className="pt-2">
                  <h2 className="text-lg font-display font-bold mb-2">Quantity</h2>
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-10 text-center">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    className="bg-pet-purple hover:bg-pet-darkPurple"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                  >
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-pet-purple text-pet-purple hover:bg-pet-purple/10"
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                  >
                    Buy Now
                  </Button>
                </div>

                {product.stock <= 0 && (
                  <p className="text-red-500 text-sm mt-2">This product is currently out of stock</p>
                )}

                {!isAuthenticated && (
                  <p className="text-sm text-gray-500 pt-2">
                    You need to <a href="/login" className="text-pet-purple hover:underline">login</a> to purchase this product.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
