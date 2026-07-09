import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";
import { Flower, Home, Mail, Menu, ShoppingBag, Sparkles, CalendarHeart, X } from "lucide-react";
import { isDemoMode } from "@/lib/demo";
import { useEffect, useState } from "react";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Subscription", href: "/subscription", icon: CalendarHeart },
    { name: "Coming Soon", href: "/coming-soon", icon: Sparkles },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isNavActive = (href: string) => {
    if (href === "/subscription") {
      return location.pathname === href || location.pathname.startsWith("/subscription/");
    }
    return location.pathname === href;
  };

  return (
    <header className={`sticky z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isDemoMode ? "top-7" : "top-0"}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-[5.5rem] sm:h-[6.5rem] md:h-28">
          <BrandLogo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`inline-flex items-center gap-2 text-sm font-medium rounded-full border-2 px-3 py-1.5 transition-all duration-200 ${
                  isNavActive(item.href)
                    ? "border-primary/60 bg-primary/10 text-primary shadow-sm"
                    : "border-primary/25 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
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
              className={`flex items-center gap-2 text-sm font-medium rounded-full border-2 px-3 py-2 transition-all duration-200 ${
                isNavActive(item.href)
                  ? "border-primary/60 bg-primary/10 text-primary shadow-sm"
                  : "border-primary/25 text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/50"
              }`}
            >
              <item.icon className="h-4 w-4" />
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
