
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useInvoices } from "@/context/InvoiceContext";
import { calculateCGST, calculateTotal, isValidPhone, generateWaybillNumber } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, Package, ArrowRight, Save, RefreshCw } from "lucide-react";

const InvoiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addInvoice } = useInvoices();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    waybillNumber: generateWaybillNumber(),
    originCity: "",
    destinationCity: "",
    sender: {
      name: "",
      address: "",
      phone: "",
    },
    receiver: {
      name: "",
      address: "",
      phone: "",
    },
    items: [
      {
        id: 1,
        description: "",
        quantity: 1,
        weight: 0,
        dimensions: "",
      },
    ],
    contents: "",
    charges: {
      basicFreight: 0,
      cod: 0,
      freightHandling: 0,
      pickupDelivery: 0,
      packaging: 0,
      cwbCharge: 0,
      otherCharges: 0,
      cgst: 0,
      total: 0,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Calculate the CGST and total whenever charges change
    const subtotal =
      formData.charges.basicFreight +
      formData.charges.cod +
      formData.charges.freightHandling +
      formData.charges.pickupDelivery +
      formData.charges.packaging +
      formData.charges.cwbCharge +
      formData.charges.otherCharges;

    const cgst = calculateCGST(subtotal);

    setFormData((prev) => ({
      ...prev,
      charges: {
        ...prev.charges,
        cgst,
        total: subtotal + cgst,
      },
    }));
  }, [
    formData.charges.basicFreight,
    formData.charges.cod,
    formData.charges.freightHandling,
    formData.charges.pickupDelivery,
    formData.charges.packaging,
    formData.charges.cwbCharge,
    formData.charges.otherCharges,
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("sender.") || name.startsWith("receiver.")) {
      const [person, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [person]: {
          ...prev[person as "sender" | "receiver"],
          [field]: value,
        },
      }));
    } else if (name.startsWith("charges.")) {
      const [_, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        charges: {
          ...prev.charges,
          [field]: parseFloat(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleItemChange = (
    id: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: prev.items.length + 1,
          description: "",
          quantity: 1,
          weight: 0,
          dimensions: "",
        },
      ],
    }));
  };

  const removeItem = (id: number) => {
    if (formData.items.length === 1) {
      return; // Prevent removing the last item
    }
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const regenerateWaybillNumber = () => {
    setFormData(prev => ({
      ...prev,
      waybillNumber: generateWaybillNumber()
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.waybillNumber.trim())
      newErrors["waybillNumber"] = "Waybill number is required";
    if (!formData.originCity.trim())
      newErrors["originCity"] = "Origin city is required";
    if (!formData.destinationCity.trim())
      newErrors["destinationCity"] = "Destination city is required";

    // Sender validation
    if (!formData.sender.name.trim())
      newErrors["sender.name"] = "Sender name is required";
    if (!formData.sender.address.trim())
      newErrors["sender.address"] = "Sender address is required";
    if (!formData.sender.phone.trim())
      newErrors["sender.phone"] = "Sender phone is required";
    else if (!isValidPhone(formData.sender.phone))
      newErrors["sender.phone"] = "Enter a valid 10-digit phone number";

    // Receiver validation
    if (!formData.receiver.name.trim())
      newErrors["receiver.name"] = "Receiver name is required";
    if (!formData.receiver.address.trim())
      newErrors["receiver.address"] = "Receiver address is required";
    if (!formData.receiver.phone.trim())
      newErrors["receiver.phone"] = "Receiver phone is required";
    else if (!isValidPhone(formData.receiver.phone))
      newErrors["receiver.phone"] = "Enter a valid 10-digit phone number";

    // Item validation
    formData.items.forEach((item, index) => {
      if (!item.description.trim())
        newErrors[`items[${index}].description`] = "Description is required";
      if (item.quantity <= 0)
        newErrors[`items[${index}].quantity`] = "Quantity must be positive";
      if (item.weight <= 0)
        newErrors[`items[${index}].weight`] = "Weight must be positive";
    });

    // Contents
    if (!formData.contents.trim())
      newErrors["contents"] = "Contents description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check the form for errors and try again.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Calculate totals
      const totalItems = formData.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalWeight = formData.items.reduce(
        (sum, item) => sum + item.weight,
        0
      );

      // Create invoice with calculated fields
      const invoice = {
        ...formData,
        status: "pending" as const,
        paymentStatus: "due" as const,
        totalItems,
        weight: totalWeight,
        grossWeight: totalWeight * 1.1, // Just an example calculation
        dimensions: formData.items
          .map((item) => item.dimensions)
          .filter(Boolean)
          .join(", "),
      };

      // Add the invoice
      const newInvoice = await addInvoice(invoice);
      
      toast({
        title: "Invoice Created",
        description: `Invoice with waybill number ${newInvoice.waybillNumber} has been created successfully.`,
      });

      // Navigate to the invoice details page
      navigate(`/invoices/${newInvoice.id}`);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create invoice. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">
            Create New Invoice
          </CardTitle>
          <CardDescription>
            Fill out the details to create a new shipping invoice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waybillNumber">Consignment Way Bill No</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="waybillNumber"
                    name="waybillNumber"
                    value={formData.waybillNumber}
                    onChange={handleInputChange}
                    className={`w-full ${errors["waybillNumber"] ? "border-red-500" : ""}`}
                    readOnly
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={regenerateWaybillNumber}
                  title="Generate new waybill number"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              {errors["waybillNumber"] && (
                <p className="text-red-500 text-sm mt-1">{errors["waybillNumber"]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contents">Contents Description</Label>
              <Input
                id="contents"
                name="contents"
                value={formData.contents}
                onChange={handleInputChange}
                className={`w-full ${errors["contents"] ? "border-red-500" : ""}`}
              />
              {errors["contents"] && (
                <p className="text-red-500 text-sm mt-1">{errors["contents"]}</p>
              )}
            </div>
          </div>

          {/* Origin and Destination */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="originCity">City of Origin</Label>
              <Input
                id="originCity"
                name="originCity"
                value={formData.originCity}
                onChange={handleInputChange}
                className={`w-full ${errors["originCity"] ? "border-red-500" : ""}`}
              />
              {errors["originCity"] && (
                <p className="text-red-500 text-sm mt-1">{errors["originCity"]}</p>
              )}
            </div>
            <div className="space-y-2 flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor="destinationCity">City of Destination</Label>
                <Input
                  id="destinationCity"
                  name="destinationCity"
                  value={formData.destinationCity}
                  onChange={handleInputChange}
                  className={`w-full ${errors["destinationCity"] ? "border-red-500" : ""}`}
                />
                {errors["destinationCity"] && (
                  <p className="text-red-500 text-sm mt-1">{errors["destinationCity"]}</p>
                )}
              </div>
              <div className="pt-8">
                <ArrowRight className="text-muted-foreground" size={20} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Sender and Receiver Information */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Sender Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sender Information</h3>
              <div className="space-y-2">
                <Label htmlFor="sender.name">Name</Label>
                <Input
                  id="sender.name"
                  name="sender.name"
                  value={formData.sender.name}
                  onChange={handleInputChange}
                  className={`w-full ${errors["sender.name"] ? "border-red-500" : ""}`}
                />
                {errors["sender.name"] && (
                  <p className="text-red-500 text-sm mt-1">{errors["sender.name"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender.address">Address</Label>
                <Textarea
                  id="sender.address"
                  name="sender.address"
                  value={formData.sender.address}
                  onChange={handleInputChange}
                  className={`w-full ${errors["sender.address"] ? "border-red-500" : ""}`}
                  rows={3}
                />
                {errors["sender.address"] && (
                  <p className="text-red-500 text-sm mt-1">{errors["sender.address"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender.phone">Phone Number</Label>
                <Input
                  id="sender.phone"
                  name="sender.phone"
                  value={formData.sender.phone}
                  onChange={handleInputChange}
                  className={`w-full ${errors["sender.phone"] ? "border-red-500" : ""}`}
                />
                {errors["sender.phone"] && (
                  <p className="text-red-500 text-sm mt-1">{errors["sender.phone"]}</p>
                )}
              </div>
            </div>

            {/* Receiver Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Receiver Information</h3>
              <div className="space-y-2">
                <Label htmlFor="receiver.name">Name</Label>
                <Input
                  id="receiver.name"
                  name="receiver.name"
                  value={formData.receiver.name}
                  onChange={handleInputChange}
                  className={`w-full ${errors["receiver.name"] ? "border-red-500" : ""}`}
                />
                {errors["receiver.name"] && (
                  <p className="text-red-500 text-sm mt-1">{errors["receiver.name"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver.address">Address</Label>
                <Textarea
                  id="receiver.address"
                  name="receiver.address"
                  value={formData.receiver.address}
                  onChange={handleInputChange}
                  className={`w-full ${errors["receiver.address"] ? "border-red-500" : ""}`}
                  rows={3}
                />
                {errors["receiver.address"] && (
                  <p className="text-red-500 text-sm mt-1">{errors["receiver.address"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver.phone">Phone Number</Label>
                <Input
                  id="receiver.phone"
                  name="receiver.phone"
                  value={formData.receiver.phone}
                  onChange={handleInputChange}
                  className={`w-full ${errors["receiver.phone"] ? "border-red-500" : ""}`}
                />
                {errors["receiver.phone"] && (
                  <p className="text-red-500 text-sm mt-1">{errors["receiver.phone"]}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Items</h3>
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid gap-4 p-4 border rounded-lg bg-background/50"
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Item {index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={formData.items.length === 1}
                      className="h-8 w-8"
                    >
                      <MinusCircle className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor={`item-${item.id}-description`}>Description</Label>
                      <Input
                        id={`item-${item.id}-description`}
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(item.id, "description", e.target.value)
                        }
                        className={
                          errors[`items[${index}].description`]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors[`items[${index}].description`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`items[${index}].description`]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`item-${item.id}-quantity`}>Quantity</Label>
                      <Input
                        id={`item-${item.id}-quantity`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className={
                          errors[`items[${index}].quantity`]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors[`items[${index}].quantity`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`items[${index}].quantity`]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`item-${item.id}-weight`}>Weight (kg)</Label>
                      <Input
                        id={`item-${item.id}-weight`}
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.weight}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "weight",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className={
                          errors[`items[${index}].weight`] ? "border-red-500" : ""
                        }
                      />
                      {errors[`items[${index}].weight`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`items[${index}].weight`]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`item-${item.id}-dimensions`}>
                        Dimensions (L×W×H)
                      </Label>
                      <Input
                        id={`item-${item.id}-dimensions`}
                        placeholder="e.g. 10×5×3 cm"
                        value={item.dimensions}
                        onChange={(e) =>
                          handleItemChange(item.id, "dimensions", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Charges */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Charges</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="charges.basicFreight">Basic Freight</Label>
                <Input
                  id="charges.basicFreight"
                  name="charges.basicFreight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.charges.basicFreight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="charges.cod">COD</Label>
                <Input
                  id="charges.cod"
                  name="charges.cod"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.charges.cod}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="charges.freightHandling">Freight Handling</Label>
                <Input
                  id="charges.freightHandling"
                  name="charges.freightHandling"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.charges.freightHandling}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="charges.pickupDelivery">Pickup & Delivery</Label>
                <Input
                  id="charges.pickupDelivery"
                  name="charges.pickupDelivery"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.charges.pickupDelivery}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="charges.packaging">Packaging</Label>
                <Input
                  id="charges.packaging"
                  name="charges.packaging"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.charges.packaging}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="charges.cwbCharge">CWB Charge</Label>
                <Input
                  id="charges.cwbCharge"
                  name="charges.cwbCharge"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.charges.cwbCharge}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="charges.otherCharges">Other Charges</Label>
                <Input
                  id="charges.otherCharges"
                  name="charges.otherCharges"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.charges.otherCharges}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-6 border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>
                  ₹
                  {(
                    formData.charges.basicFreight +
                    formData.charges.cod +
                    formData.charges.freightHandling +
                    formData.charges.pickupDelivery +
                    formData.charges.packaging +
                    formData.charges.cwbCharge +
                    formData.charges.otherCharges
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CGST (18%):</span>
                <span>₹{formData.charges.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total:</span>
                <span>₹{formData.charges.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit"
            className="px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                Processing...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Invoice
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default InvoiceForm;
