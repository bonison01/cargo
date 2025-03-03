
import React from "react";
import { Package, Truck, MapPin, Check, Clock } from "lucide-react";
import { formatDate } from "@/utils/helpers";

interface StatusTimelineProps {
  status: string;
  date: string;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ status, date }) => {
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

  return (
    <div className="space-y-4 py-2">
      {getStatusSteps(status).map((step, index) => (
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
                    ? formatDate(date) 
                    : "Completed"}
                </span>
              ) : step.status === "cancelled" ? (
                "Cancelled"
              ) : (
                "Pending"
              )}
            </p>
          </div>
          {index < getStatusSteps(status).length - 1 && (
            <div className="absolute left-4 ml-[14px] h-full w-px bg-muted-foreground/20" />
          )}
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;
