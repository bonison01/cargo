
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoices, InvoiceStatus, PaymentStatus } from "@/context/InvoiceContext";
import { formatDate, formatCurrency, formatConsignmentNumber } from "@/utils/helpers";
import StatusBadge from "@/components/ui/StatusBadge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Box,
  Calendar,
  FileText,
  MapPin,
  Package,
  Phone,
  Printer,
  User,
  Truck,
  CreditCard,
  X,
} from "lucide-react";



const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getInvoice, updateInvoiceStatus, updatePaymentStatus } = useInvoices();

  const invoice = getInvoice(id || "");

  const [shipmentStatus, setShipmentStatus] = useState<InvoiceStatus>(
    invoice?.status || "pending"
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    invoice?.paymentStatus || "due"
  );

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <X className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-medium mb-2">Invoice Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The invoice you are looking for doesn't exist or has been removed
        </p>
        <Button onClick={() => navigate("/invoices")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Button>
      </div>
    );
  }

  const handleStatusChange = (status: InvoiceStatus) => {
    setShipmentStatus(status);
    updateInvoiceStatus(invoice.id, status);
    toast({
      title: "Status Updated",
      description: `Shipment status has been updated to ${status}`,
    });
  };

  const handlePaymentStatusChange = (status: PaymentStatus) => {
    setPaymentStatus(status);
    updatePaymentStatus(invoice.id, status);
    toast({
      title: "Payment Status Updated",
      description: `Payment status has been updated to ${status}`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in print:p-6">
      <div className="flex justify-between items-center print:hidden">
        <Button
          variant="outline"
          onClick={() => navigate("/invoices")}
          className="print:hidden"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handlePrint} className="print:hidden">
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>

      <Card className="glass print:bg-white print:border-none">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <CardTitle className="text-2xl font-medium flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Invoice
              </CardTitle>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                {formatDate(invoice.date)}
              </div>
            </div>
            <div className="mt-4 md:mt-0 space-y-1 md:text-right">
              <h3 className="font-medium">Consignment Number</h3>
              <p className="text-muted-foreground">{formatConsignmentNumber(invoice.consignmentNumber)}</p>
              <h3 className="font-medium mt-2">Waybill Number</h3>
              <p className="text-muted-foreground">{invoice.waybillNumber}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:hidden">
            <div className="space-y-3">
              <Label>Shipment Status</Label>
              <Select
                value={shipmentStatus}
                onValueChange={(value) => handleStatusChange(value as InvoiceStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>Payment Status</Label>
              <Select
                value={paymentStatus}
                onValueChange={(value) => handlePaymentStatusChange(value as PaymentStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="due">Due</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Print Status Display */}
          <div className="hidden print:flex print:justify-between print:items-center">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="font-medium">Status:</span>
              <span>{shipmentStatus.charAt(0).toUpperCase() + shipmentStatus.slice(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">Payment:</span>
              <span>{paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            <StatusBadge status={shipmentStatus} type="invoice" />
            <StatusBadge status={paymentStatus} type="payment" />
          </div>

          <Separator />

          {/* Route */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Shipping Route
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg bg-muted/50">
              <div className="flex-1">
                <span className="block text-sm text-muted-foreground">Origin</span>
                <span className="font-medium">{invoice.originCity}</span>
              </div>
              <Truck className="hidden sm:block h-5 w-5 text-muted-foreground" />
              <div className="flex-1 sm:text-right">
                <span className="block text-sm text-muted-foreground">Destination</span>
                <span className="font-medium">{invoice.destinationCity}</span>
              </div>
            </div>
          </div>

          {/* Sender and Receiver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Sender
              </h3>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{invoice.sender.name}</p>
                <p className="text-sm whitespace-pre-line">{invoice.sender.address}</p>
                <p className="text-sm flex items-center gap-1 mt-2">
                  <Phone className="h-3 w-3" />
                  {invoice.sender.phone}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Receiver
              </h3>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{invoice.receiver.name}</p>
                <p className="text-sm whitespace-pre-line">{invoice.receiver.address}</p>
                <p className="text-sm flex items-center gap-1 mt-2">
                  <Phone className="h-3 w-3" />
                  {invoice.receiver.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Box className="h-4 w-4" />
              Package Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="block text-sm text-muted-foreground">Total Items</span>
                <span className="font-medium">{invoice.totalItems}</span>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground">Weight</span>
                <span className="font-medium">{invoice.weight} kg</span>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground">Gross Weight</span>
                <span className="font-medium">{invoice.grossWeight.toFixed(2)} kg</span>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground">Contents</span>
                <span className="font-medium truncate max-w-xs">{invoice.contents}</span>
              </div>
            </div>
            
            {invoice.dimensions && (
              <div>
                <span className="block text-sm text-muted-foreground">Dimensions</span>
                <span className="font-medium">{invoice.dimensions}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Items
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Dimensions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y">
                  {invoice.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {item.weight} kg
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {item.dimensions || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charges */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Charges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-muted-foreground">Basic Freight</span>
                  <span className="text-right">{formatCurrency(invoice.charges.basicFreight)}</span>
                  
                  <span className="text-sm text-muted-foreground">COD</span>
                  <span className="text-right">{formatCurrency(invoice.charges.cod)}</span>
                  
                  <span className="text-sm text-muted-foreground">Freight Handling</span>
                  <span className="text-right">{formatCurrency(invoice.charges.freightHandling)}</span>
                  
                  <span className="text-sm text-muted-foreground">Pickup and Delivery</span>
                  <span className="text-right">{formatCurrency(invoice.charges.pickupDelivery)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-muted-foreground">Packaging</span>
                  <span className="text-right">{formatCurrency(invoice.charges.packaging)}</span>
                  
                  <span className="text-sm text-muted-foreground">CWB Charge</span>
                  <span className="text-right">{formatCurrency(invoice.charges.cwbCharge)}</span>
                  
                  <span className="text-sm text-muted-foreground">Other Charges</span>
                  <span className="text-right">{formatCurrency(invoice.charges.otherCharges)}</span>
                  

                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">{formatCurrency(invoice.charges.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-6 flex justify-between print:hidden">
          <Button
            variant="outline"
            onClick={() => navigate("/invoices")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InvoiceDetail;
