import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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
  loading: boolean;
  addInvoice: (invoice: Omit<Invoice, "id" | "consignmentNumber">) => Promise<Invoice>;
  getInvoice: (id: string) => Invoice | undefined;
  searchInvoices: (query: string) => Invoice[];
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<void>;
  updatePaymentStatus: (id: string, status: PaymentStatus) => Promise<void>;
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
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchInvoices();
    } else {
      const savedInvoices = localStorage.getItem("invoices");
      setInvoices(savedInvoices ? JSON.parse(savedInvoices) : []);
      setLoading(false);
    }
  }, [user]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const { data: invoicesData, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from("invoice_items")
        .select("*");

      if (itemsError) {
        throw itemsError;
      }

      const transformedInvoices: Invoice[] = invoicesData.map((dbInvoice) => {
        const invoiceItems = itemsData
          ? itemsData.filter((item) => item.invoice_id === dbInvoice.id)
          : [];

        return {
          id: dbInvoice.id,
          date: dbInvoice.date,
          consignmentNumber: dbInvoice.consignment_number,
          waybillNumber: dbInvoice.waybill_number,
          originCity: dbInvoice.origin_city,
          destinationCity: dbInvoice.destination_city,
          sender: {
            name: dbInvoice.sender_name,
            address: dbInvoice.sender_address,
            phone: dbInvoice.sender_phone,
          },
          receiver: {
            name: dbInvoice.receiver_name,
            address: dbInvoice.receiver_address,
            phone: dbInvoice.receiver_phone,
          },
          items: invoiceItems.map((item) => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            weight: item.weight,
            dimensions: item.dimensions,
          })),
          totalItems: dbInvoice.total_items,
          weight: dbInvoice.weight,
          grossWeight: dbInvoice.gross_weight,
          contents: dbInvoice.contents,
          dimensions: dbInvoice.dimensions,
          charges: {
            basicFreight: dbInvoice.basic_freight,
            cod: dbInvoice.cod,
            freightHandling: dbInvoice.freight_handling,
            pickupDelivery: dbInvoice.pickup_delivery,
            packaging: dbInvoice.packaging,
            cwbCharge: dbInvoice.cwb_charge,
            otherCharges: dbInvoice.other_charges,
            cgst: dbInvoice.cgst,
            total: dbInvoice.total,
          },
          status: dbInvoice.status as InvoiceStatus,
          paymentStatus: dbInvoice.payment_status as PaymentStatus,
        };
      });

      setInvoices(transformedInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load invoices. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateConsignmentNumber = () => {
    const dateString = new Date().toISOString().substring(0, 10).replace(/-/g, "");
    const randomDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `MATC${dateString}${randomDigits}`;
  };

  const addInvoice = async (invoiceData: Omit<Invoice, "id" | "consignmentNumber">) => {
    if (!user) {
      const newInvoice: Invoice = {
        ...invoiceData,
        id: Math.random().toString(36).substring(2, 9),
        consignmentNumber: generateConsignmentNumber(),
      };
      setInvoices((prev) => [...prev, newInvoice]);
      localStorage.setItem("invoices", JSON.stringify([...invoices, newInvoice]));
      return newInvoice;
    }

    try {
      const consignmentNumber = generateConsignmentNumber();

      const { data: invoiceResult, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          date: invoiceData.date,
          consignment_number: consignmentNumber,
          waybill_number: invoiceData.waybillNumber,
          origin_city: invoiceData.originCity,
          destination_city: invoiceData.destinationCity,
          sender_name: invoiceData.sender.name,
          sender_address: invoiceData.sender.address,
          sender_phone: invoiceData.sender.phone,
          receiver_name: invoiceData.receiver.name,
          receiver_address: invoiceData.receiver.address,
          receiver_phone: invoiceData.receiver.phone,
          total_items: invoiceData.totalItems,
          weight: invoiceData.weight,
          gross_weight: invoiceData.grossWeight,
          contents: invoiceData.contents,
          dimensions: invoiceData.dimensions,
          basic_freight: invoiceData.charges.basicFreight,
          cod: invoiceData.charges.cod,
          freight_handling: invoiceData.charges.freightHandling,
          pickup_delivery: invoiceData.charges.pickupDelivery,
          packaging: invoiceData.charges.packaging,
          cwb_charge: invoiceData.charges.cwbCharge,
          other_charges: invoiceData.charges.otherCharges,
          cgst: invoiceData.charges.cgst,
          total: invoiceData.charges.total,
          status: invoiceData.status,
          payment_status: invoiceData.paymentStatus,
        })
        .select("id")
        .single();

      if (invoiceError) throw invoiceError;

      const invoiceItems = invoiceData.items.map((item) => ({
        invoice_id: invoiceResult.id,
        description: item.description,
        quantity: item.quantity,
        weight: item.weight,
        dimensions: item.dimensions || "",
      }));

      if (invoiceItems.length > 0) {
        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(invoiceItems);

        if (itemsError) throw itemsError;
      }

      await fetchInvoices();

      const newInvoice: Invoice = {
        ...invoiceData,
        id: invoiceResult.id,
        consignmentNumber,
      };

      return newInvoice;
    } catch (error) {
      console.error("Error adding invoice:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create invoice. Please try again.",
      });
      throw error;
    }
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

  const updateInvoiceStatus = async (id: string, status: InvoiceStatus) => {
    if (!user) {
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, status } : invoice
        )
      );
      localStorage.setItem(
        "invoices",
        JSON.stringify(
          invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, status } : invoice
          )
        )
      );
      return;
    }

    try {
      const { error } = await supabase
        .from("invoices")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, status } : invoice
        )
      );
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update invoice status. Please try again.",
      });
      throw error;
    }
  };

  const updatePaymentStatus = async (id: string, status: PaymentStatus) => {
    if (!user) {
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, paymentStatus: status } : invoice
        )
      );
      localStorage.setItem(
        "invoices",
        JSON.stringify(
          invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, paymentStatus: status } : invoice
          )
        )
      );
      return;
    }

    try {
      const { error } = await supabase
        .from("invoices")
        .update({ payment_status: status })
        .eq("id", id);

      if (error) throw error;

      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id ? { ...invoice, paymentStatus: status } : invoice
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update payment status. Please try again.",
      });
      throw error;
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        loading,
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
