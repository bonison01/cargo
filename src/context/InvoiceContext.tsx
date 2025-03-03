
import React, { createContext, useContext, useState, useEffect } from "react";

export type InvoiceStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'due' | 'paid';

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  weight: number;
  dimensions: string;
}

export interface Invoice {
  id: string;
  date: string;
  consignmentNumber: string;
  waybillNumber: string;
  originCity: string;
  destinationCity: string;
  sender: {
    name: string;
    address: string;
    phone: string;
  };
  receiver: {
    name: string;
    address: string;
    phone: string;
  };
  items: InvoiceItem[];
  totalItems: number;
  weight: number;
  grossWeight: number;
  contents: string;
  dimensions: string;
  charges: {
    basicFreight: number;
    cod: number;
    freightHandling: number;
    pickupDelivery: number;
    packaging: number;
    cwbCharge: number;
    otherCharges: number;
    cgst: number;
    total: number;
  };
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
}

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, "id" | "consignmentNumber">) => Invoice;
  getInvoice: (id: string) => Invoice | undefined;
  searchInvoices: (query: string) => Invoice[];
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoices must be used within an InvoiceProvider");
  }
  return context;
};

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const savedInvoices = localStorage.getItem("invoices");
    return savedInvoices ? JSON.parse(savedInvoices) : [];
  });

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  const generateConsignmentNumber = () => {
    const dateString = new Date().toISOString().substring(0, 10).replace(/-/g, "");
    const randomDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `MATC${dateString}${randomDigits}`;
  };

  const addInvoice = (invoiceData: Omit<Invoice, "id" | "consignmentNumber">) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Math.random().toString(36).substring(2, 9),
      consignmentNumber: generateConsignmentNumber(),
    };
    setInvoices((prev) => [...prev, newInvoice]);
    return newInvoice;
  };

  const getInvoice = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

  const searchInvoices = (query: string) => {
    if (!query) return invoices;
    
    const lowerQuery = query.toLowerCase();
    return invoices.filter(
      (invoice) =>
        invoice.consignmentNumber.toLowerCase().includes(lowerQuery) ||
        invoice.waybillNumber.toLowerCase().includes(lowerQuery) ||
        invoice.sender.name.toLowerCase().includes(lowerQuery) ||
        invoice.receiver.name.toLowerCase().includes(lowerQuery) ||
        invoice.originCity.toLowerCase().includes(lowerQuery) ||
        invoice.destinationCity.toLowerCase().includes(lowerQuery)
    );
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === id ? { ...invoice, status } : invoice
      )
    );
  };

  const updatePaymentStatus = (id: string, status: PaymentStatus) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === id ? { ...invoice, paymentStatus: status } : invoice
      )
    );
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        getInvoice,
        searchInvoices,
        updateInvoiceStatus,
        updatePaymentStatus,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
