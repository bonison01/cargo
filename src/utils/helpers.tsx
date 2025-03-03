
import { format } from "date-fns";

// Format date to display in a human-readable format
export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "PPP");
  } catch (error) {
    return dateString;
  }
};

// Format currency with proper symbol and decimal places
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Calculate subtotal without tax
export const calculateSubtotal = (charges: {
  basicFreight: number;
  cod: number;
  freightHandling: number;
  pickupDelivery: number;
  packaging: number;
  cwbCharge: number;
  otherCharges: number;
}) => {
  return (
    charges.basicFreight +
    charges.cod +
    charges.freightHandling +
    charges.pickupDelivery +
    charges.packaging +
    charges.cwbCharge +
    charges.otherCharges
  );
};

// Calculate CGST (tax) based on subtotal
export const calculateCGST = (subtotal: number) => {
  // Assuming a GST rate of 18%
  return subtotal * 0.18;
};

// Calculate total with tax
export const calculateTotal = (charges: {
  basicFreight: number;
  cod: number;
  freightHandling: number;
  pickupDelivery: number;
  packaging: number;
  cwbCharge: number;
  otherCharges: number;
  cgst: number;
}) => {
  return (
    charges.basicFreight +
    charges.cod +
    charges.freightHandling +
    charges.pickupDelivery +
    charges.packaging +
    charges.cwbCharge +
    charges.otherCharges +
    charges.cgst
  );
};

// Validate phone number (basic validation)
export const isValidPhone = (phone: string) => {
  return /^\d{10}$/.test(phone);
};

// Format consignment number with spaces for better readability
export const formatConsignmentNumber = (num: string) => {
  if (!num) return '';
  // Add a space after MATC and then every 4 characters
  return num.replace(/^(MATC)(\d{4})(\d{4})(\d{4})$/, '$1 $2 $3 $4');
};
