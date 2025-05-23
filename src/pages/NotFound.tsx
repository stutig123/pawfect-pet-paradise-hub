
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="text-7xl mb-6">🐾</div>
        <h1 className="text-4xl font-display font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl mb-8 max-w-lg mx-auto">
          Oops! Looks like the page you're looking for has run away. Let's help you find your way back.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/">
            <Button className="bg-pet-purple hover:bg-pet-darkPurple">
              Return to Home
            </Button>
          </Link>
          <Link to="/pets">
            <Button variant="outline" className="border-pet-purple text-pet-purple hover:bg-pet-purple/10">
              Browse Pets
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
