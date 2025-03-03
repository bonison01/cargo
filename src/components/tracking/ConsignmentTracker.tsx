
import React, { useState } from "react";
import { useInvoices } from "@/context/InvoiceContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TrackingForm from "./TrackingForm";
import TrackingResult from "./TrackingResult";

const ConsignmentTracker: React.FC = () => {
  const { invoices } = useInvoices();
  const [trackedInvoice, setTrackedInvoice] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = (cleanedNumber: string) => {
    setNotFound(false);
    
    const found = invoices.find(
      (invoice) => invoice.consignmentNumber.toUpperCase() === cleanedNumber
    );

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
