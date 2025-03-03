
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Package,
  Truck,
  FileText,
  Search,
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Package className="h-4 w-4 mr-2" />,
      public: true,
    },
    {
      name: "Create Invoice",
      path: "/create-invoice",
      icon: <FileText className="h-4 w-4 mr-2" />,
      public: false,
    },
    {
      name: "View Invoices",
      path: "/invoices",
      icon: <Search className="h-4 w-4 mr-2" />,
      public: false,
    },
    {
      name: "Track Shipment",
      path: "/track",
      icon: <Truck className="h-4 w-4 mr-2" />,
      public: true,
    },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return "U";
    
    const nameParts = user.user_metadata.full_name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center text-lg font-semibold transition-all hover:opacity-80"
          >
            <Package className="h-6 w-6 mr-2 text-mateng" />
            <span className="text-mateng font-bold">Mateng</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems
            .filter(item => item.public || user)
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-mateng",
                  location.pathname === item.path
                    ? "text-mateng"
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
        </nav>

        {/* Authentication Actions */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.user_metadata?.full_name || user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")} className="gap-2">
                <LogIn className="h-4 w-4" />
                <span>Log in</span>
              </Button>
              <Button onClick={() => navigate("/auth?tab=register")} className="gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Sign up</span>
              </Button>
            </>
          )}
        </div>

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
              {navItems
                .filter(item => item.public || user)
                .map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center py-2 text-sm font-medium transition-colors hover:text-mateng",
                      location.pathname === item.path
                        ? "text-mateng"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              
              {user ? (
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  className="mt-2 w-full justify-start"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out ({user.user_metadata?.full_name || user.email})</span>
                </Button>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigate("/auth");
                      setMobileMenuOpen(false);
                    }} 
                    className="w-full justify-start"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Log in</span>
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate("/auth?tab=register");
                      setMobileMenuOpen(false);
                    }} 
                    className="w-full justify-start"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Sign up</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
