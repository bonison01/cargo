
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "@/context/InvoiceContext";
import { formatDate, formatConsignmentNumber } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import Captcha from "@/components/ui/Captcha";
import {
  Truck,
  Search,
  Package,
  MapPin,
  ArrowRight,
  Clock,
  Calendar,
  Info,
  Check,
  XCircle,
} from "lucide-react";

const ConsignmentTracker: React.FC = () => {
  const navigate = useNavigate();
  const { invoices } = useInvoices();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackedInvoice, setTrackedInvoice] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    
    if (!isCaptchaVerified) {
      return;
    }
    
    setNotFound(false);

    // Remove spaces and make uppercase
    const cleanedNumber = trackingNumber.replace(/\s+/g, "").toUpperCase();
    
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

  const handleViewDetails = () => {
    if (trackedInvoice) {
      navigate(`/invoices/${trackedInvoice.id}`);
    }
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { label: "Order Received", status: "completed", icon: <Package className="h-4 w-4" /> },
      { 
        label: "Dispatched", 
        status: status === "pending" ? "upcoming" : "completed",
        icon: <Truck className="h-4 w-4" />
      },
      { 
        label: "In Transit", 
        status: status === "pending" || status === "shipped" ? "upcoming" : status === "cancelled" ? "cancelled" : "completed",
        icon: <MapPin className="h-4 w-4" />
      },
      { 
        label: "Delivered", 
        status: status === "delivered" ? "completed" : status === "cancelled" ? "cancelled" : "upcoming",
        icon: <Check className="h-4 w-4" />
      },
    ];

    return steps;
  };

  const handleCaptchaVerify = (isVerified: boolean) => {
    setIsCaptchaVerified(isVerified);
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
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter consignment number (e.g., MATC20230501xxxx)"
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={!trackingNumber.trim()}>Track</Button>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Captcha onVerify={handleCaptchaVerify} />
              </div>
              <div className="space-y-2">
                {searchAttempted && !isCaptchaVerified && (
                  <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-amber-500" />
                      <p className="font-medium">Please verify the captcha first</p>
                    </div>
                  </div>
                )}
                
                {notFound && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                      <p className="font-medium">No shipment found with that consignment number</p>
                    </div>
                    <p className="ml-7 text-muted-foreground">
                      Please check the consignment number and try again.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>

          {trackedInvoice && (
            <div className="space-y-6 animate-slide-in">
              <div className="rounded-lg border p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-lg">
                      {formatConsignmentNumber(trackedInvoice.consignmentNumber)}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(trackedInvoice.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Info className="h-3.5 w-3.5" />
                        <span>Waybill: {trackedInvoice.waybillNumber}</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={trackedInvoice.status} type="invoice" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Shipment Route</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{trackedInvoice.originCity}</p>
                    <p className="text-sm truncate max-w-[200px]">{trackedInvoice.sender.name}</p>
                  </div>
                  <div className="hidden sm:block">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-medium">{trackedInvoice.destinationCity}</p>
                    <p className="text-sm truncate max-w-[200px]">{trackedInvoice.receiver.name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Tracking Status</h3>
                <div className="space-y-6 py-2">
                  {getStatusSteps(trackedInvoice.status).map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        step.status === "completed" 
                          ? "bg-primary text-primary-foreground" 
                          : step.status === "cancelled"
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {step.icon}
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="font-medium">{step.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {step.status === "completed" ? (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {index === 0 
                                ? formatDate(trackedInvoice.date) 
                                : "Completed"}
                            </span>
                          ) : step.status === "cancelled" ? (
                            "Cancelled"
                          ) : (
                            "Pending"
                          )}
                        </p>
                      </div>
                      {index < getStatusSteps(trackedInvoice.status).length - 1 && (
                        <div className="absolute left-4 ml-[14px] h-full w-px bg-muted-foreground/20" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Package Details</p>
                    <p className="text-sm text-muted-foreground">
                      {trackedInvoice.totalItems} item(s), {trackedInvoice.weight} kg
                    </p>
                  </div>
                  <Button onClick={handleViewDetails}>
                    View Full Details
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsignmentTracker;
