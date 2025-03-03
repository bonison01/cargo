
import React from "react";
import { cn } from "@/lib/utils";
import { InvoiceStatus, PaymentStatus } from "@/context/InvoiceContext";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: InvoiceStatus | PaymentStatus;
  type: "invoice" | "payment";
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type, className }) => {
  const getStatusConfig = () => {
    const configs = {
      invoice: {
        pending: {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        },
        shipped: {
          label: "Shipped",
          className: "bg-blue-100 text-blue-800 hover:bg-blue-200"
        },
        delivered: {
          label: "Delivered",
          className: "bg-green-100 text-green-800 hover:bg-green-200"
        },
        cancelled: {
          label: "Cancelled",
          className: "bg-red-100 text-red-800 hover:bg-red-200"
        }
      },
      payment: {
        due: {
          label: "Payment Due",
          className: "bg-orange-100 text-orange-800 hover:bg-orange-200"
        },
        paid: {
          label: "Paid",
          className: "bg-green-100 text-green-800 hover:bg-green-200"
        }
      }
    };

    return type === "invoice" 
      ? configs.invoice[status as InvoiceStatus] 
      : configs.payment[status as PaymentStatus];
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium rounded-full px-3 py-1 animate-scale-in",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
