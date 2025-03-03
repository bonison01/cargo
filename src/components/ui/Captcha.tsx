
import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { RefreshCw } from "lucide-react";
import { Button } from "./button";

interface CaptchaProps {
  onVerify: (isVerified: boolean) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput("");
    setIsVerified(false);
    setError(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    const verified = userInput === captchaText;
    setIsVerified(verified);
    setError(!verified);
    onVerify(verified);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="select-none flex items-center justify-center p-3 bg-muted text-primary-foreground text-lg font-medium tracking-[0.2em] rounded-md w-40 h-12 overflow-hidden">
            <span className="blur-[0.5px] text-foreground">{captchaText}</span>
            {/* Add noise to make the captcha harder to read */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-foreground w-px h-px"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="absolute top-1/2 right-0 -translate-y-1/2 mr-1"
            onClick={generateCaptcha}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh captcha</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="captcha-input">Enter the code above</Label>
        <Input
          id="captcha-input"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className={error ? "border-red-500" : ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleVerify();
            }
          }}
        />
        {error && (
          <p className="text-red-500 text-sm">
            Incorrect code. Please try again.
          </p>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleVerify}
        disabled={isVerified}
      >
        {isVerified ? "Verified ✓" : "Verify"}
      </Button>
    </div>
  );
};

export default Captcha;
