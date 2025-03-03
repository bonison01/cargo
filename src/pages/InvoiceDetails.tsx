
import React from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import InvoiceDetail from "@/components/InvoiceDetail";

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <InvoiceDetail />
      </main>
    </div>
  );
};

export default InvoiceDetails;
