
import React from "react";
import Header from "@/components/Header";
import InvoiceForm from "@/components/InvoiceForm";

const CreateInvoice: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <InvoiceForm />
      </main>
    </div>
  );
};

export default CreateInvoice;
