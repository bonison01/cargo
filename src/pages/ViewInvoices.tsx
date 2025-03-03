
import React from "react";
import Header from "@/components/Header";
import InvoiceList from "@/components/InvoiceList";

const ViewInvoices: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <InvoiceList />
      </main>
    </div>
  );
};

export default ViewInvoices;
