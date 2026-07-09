import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="font-heading text-5xl sm:text-6xl font-bold text-primary">404</h1>
          <p className="text-lg text-muted-foreground">Oops! This page wandered off the stem trail.</p>
          <Button asChild size="lg" className="w-full sm:w-auto min-h-11">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
