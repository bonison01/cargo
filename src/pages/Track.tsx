
import React, { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { ConsignmentTracker } from "@/components/tracking";
import { useInvoices } from "@/context/InvoiceContext";

const Track: React.FC = () => {
  const { loading, invoices } = useInvoices();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!invoices || invoices.length === 0)) {
      toast({
        title: "Demo Mode",
        description: "You are using tracking in demo mode. Login to track actual shipments.",
      });
    }
  }, [loading, invoices, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <ConsignmentTracker />
      </main>
    </div>
  );
};

export default Track;
