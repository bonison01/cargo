
import React, { useState } from "react";
import { Search, Info, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Captcha from "@/components/ui/Captcha";

interface TrackingFormProps {
  onTrack: (trackingNumber: string) => void;
  notFound: boolean;
}

const TrackingForm: React.FC<TrackingFormProps> = ({ onTrack, notFound }) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempted(true);
    
    if (!isCaptchaVerified) {
      return;
    }
    
    // Remove spaces and make uppercase
    const cleanedNumber = trackingNumber.replace(/\s+/g, "").toUpperCase();
    onTrack(cleanedNumber);
  };

  const handleCaptchaVerify = (isVerified: boolean) => {
    setIsCaptchaVerified(isVerified);
  };

  return (
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
  );
};

export default TrackingForm;
