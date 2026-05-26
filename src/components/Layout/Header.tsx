import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flower, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Coming Soon", href: "/coming-soon" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Flower className="h-8 w-8 text-primary" />
            <span className="font-script text-2xl sm:text-3xl leading-none pt-0.5">
              <span className="text-foreground">Made You </span>
              <span className="text-primary">Blush</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button + Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <Button asChild variant="default" size="sm" className="hidden md:inline-flex">
              <Link to="/create-bouquet">
                <Flower className="h-4 w-4" />
                Build a Bouquet
              </Link>
            </Button>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-accent focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Button asChild variant="default" size="sm" className="w-full">
            <Link to="/create-bouquet" onClick={() => setMobileMenuOpen(false)}>
              <Flower className="mr-2 h-4 w-4" />
              Build a Bouquet
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
