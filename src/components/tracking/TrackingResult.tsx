
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import StatusTimeline from "./StatusTimeline";
import { formatDate, formatConsignmentNumber } from "@/utils/helpers";

interface TrackingResultProps {
  trackedInvoice: any;
}

const TrackingResult: React.FC<TrackingResultProps> = ({ trackedInvoice }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/invoices/${trackedInvoice.id}`);
  };

  return (
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
        <StatusTimeline status={trackedInvoice.status} date={trackedInvoice.date} />
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
  );
};

export default TrackingResult;
