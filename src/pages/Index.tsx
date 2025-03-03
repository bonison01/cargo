
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Package, FileText, Truck, Search, ArrowRight } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <FileText className="h-10 w-10 text-mateng" />,
      title: "Create Invoices",
      description: "Generate professional invoices for your shipments with auto-generated consignment numbers.",
      link: "/create-invoice",
      linkText: "Create Invoice",
    },
    {
      icon: <Search className="h-10 w-10 text-mateng" />,
      title: "Manage Invoices",
      description: "View, search, and manage all your shipping invoices in one place.",
      link: "/invoices",
      linkText: "View Invoices",
    },
    {
      icon: <Truck className="h-10 w-10 text-mateng" />,
      title: "Track Shipments",
      description: "Allow customers to track their shipments using their consignment number.",
      link: "/track",
      linkText: "Track Shipment",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-mateng-light to-white dark:from-mateng-dark/20 dark:to-gray-950/20" />
          <div 
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMjUyMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"
            style={{ opacity: 0.6 }}
          />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-in">
                Mateng Shipping & Invoice Management
              </h1>
              <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
                Create, track, and manage your shipping invoices with our elegant and intuitive platform.
              </p>
              <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: "200ms" }}>
                <Button asChild size="lg" className="bg-mateng hover:bg-mateng/90">
                  <Link to="/create-invoice">
                    Create Invoice
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-mateng text-mateng hover:bg-mateng/10">
                  <Link to="/track">Track Shipment</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 container">
          <h2 className="text-3xl font-bold text-center mb-12">What You Can Do</h2>
          <div className="grid gap-8 md:grid-cols-3 animate-fade-in" style={{ animationDelay: "300ms" }}>
            {features.map((feature, index) => (
              <Card key={index} className="glass h-full border transition-all duration-300 hover:shadow-md hover:border-mateng/20">
                <CardHeader>
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-mateng/10 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full border-mateng text-mateng hover:bg-mateng/10">
                    <Link to={feature.link}>
                      {feature.linkText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid gap-8 md:gap-12 md:grid-cols-3 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-mateng text-white font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Invoice</h3>
                <p className="text-muted-foreground">
                  Fill out the invoice form with shipment details, sender and receiver information.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-mateng text-white font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Consignment Number</h3>
                <p className="text-muted-foreground">
                  The system automatically generates a unique consignment number for tracking.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-mateng text-white font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Track & Manage</h3>
                <p className="text-muted-foreground">
                  Track shipments, update status, and manage all your invoices from a central dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Package className="h-6 w-6 mr-2 text-mateng" />
              <span className="font-semibold text-lg">Mateng</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Mateng. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
