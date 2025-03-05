
import React, { useState, useEffect } from "react";
import { useInvoices } from "@/context/InvoiceContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import TrackingForm from "./TrackingForm";
import TrackingResult from "./TrackingResult";

const ConsignmentTracker: React.FC = () => {
  const { invoices, loading } = useInvoices();
  const [trackedInvoice, setTrackedInvoice] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  // Clear the tracked invoice when invoices change
  useEffect(() => {
    setTrackedInvoice(null);
    setNotFound(false);
  }, [invoices]);

  const handleTrack = (cleanedNumber: string) => {
    setNotFound(false);
    
    if (loading) {
      toast({
        title: "Loading shipment data",
        description: "Please wait while we load the shipment data...",
      });
      return;
    }
    
    if (!invoices || invoices.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No shipment data available. Please try again later.",
      });
      return;
    }

    console.log("Searching for consignment:", cleanedNumber);
    console.log("Available invoices:", invoices.length);
    
    const found = invoices.find(
      (invoice) => invoice.consignmentNumber.toUpperCase() === cleanedNumber
    );

    console.log("Found invoice:", found ? "Yes" : "No");

    if (found) {
      setTrackedInvoice(found);
    } else {
      setTrackedInvoice(null);
      setNotFound(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">Track your Shipment</CardTitle>
          <CardDescription>
            Enter your consignment number to track your shipment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TrackingForm onTrack={handleTrack} notFound={notFound} />
          {trackedInvoice && <TrackingResult trackedInvoice={trackedInvoice} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsignmentTracker;
