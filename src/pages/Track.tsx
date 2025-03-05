
import React, { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { ConsignmentTracker } from "@/components/tracking";
import { useInvoices } from "@/context/InvoiceContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Track: React.FC = () => {
  const { loading, invoices } = useInvoices();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && (!invoices || invoices.length === 0)) {
      toast({
        title: "No Shipments Found",
        description: "No shipment data available. Create an invoice to track shipments.",
      });
    }
  }, [loading, invoices, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        {!user && (
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-900">
            <h3 className="font-medium text-blue-800 dark:text-blue-300">Tracking Without Account</h3>
            <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
              You can track shipments without an account. To create or view invoices, please{" "}
              <Link to="/auth" className="font-medium underline">
                sign in or create an account
              </Link>
              .
            </p>
          </div>
        )}
        <ConsignmentTracker />
      </main>
    </div>
  );
};

export default Track;
