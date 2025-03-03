
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Package,
  Truck,
  FileText,
  Search,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Package className="h-4 w-4 mr-2" />,
    },
    {
      name: "Create Invoice",
      path: "/create-invoice",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      name: "View Invoices",
      path: "/invoices",
      icon: <Search className="h-4 w-4 mr-2" />,
    },
    {
      name: "Track Shipment",
      path: "/track",
      icon: <Truck className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center text-lg font-semibold transition-all hover:opacity-80"
          >
            <Package className="h-6 w-6 mr-2 text-primary" />
            <span className="text-primary">TrackShip</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border animate-in slide-in">
            <div className="container py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center py-2 text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
