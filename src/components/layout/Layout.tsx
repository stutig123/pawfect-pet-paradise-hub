
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;
