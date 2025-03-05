
import React from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Package, MapPin, IndianRupee, Route, Weight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const DeliveryRates: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Delivery Rates</h1>
          <p className="text-muted-foreground">
            Check our competitive cargo shipping rates between Imphal and Delhi
          </p>
        </div>

        <Tabs defaultValue="imphal-delhi" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="imphal-delhi" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              <span>Imphal to Delhi</span>
            </TabsTrigger>
            <TabsTrigger value="delhi-imphal" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              <span>Delhi to Imphal</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="imphal-delhi" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-mateng" />
                  Imphal to Delhi Rates
                </CardTitle>
                <CardDescription>Cargo shipping rates from Imphal to Delhi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="bg-mateng/5 p-6 rounded-lg border border-mateng/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-mateng/10 p-3 rounded-full">
                        <Truck className="h-6 w-6 text-mateng" />
                      </div>
                      <h3 className="text-xl font-semibold">Base Shipping Rate</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center pb-3 border-b">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-muted-foreground" />
                          <span>Base Rate per Kg</span>
                        </div>
                        <div className="flex items-center font-semibold text-lg">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          <span>150</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b">
                        <div className="flex items-center gap-2">
                          <Weight className="h-5 w-5 text-muted-foreground" />
                          <span>Handling Charge per Parcel</span>
                        </div>
                        <div className="flex items-center font-semibold text-lg">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          <span>120</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-4">Additional Charges</h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span>Packing Charges</span>
                        <span className="text-muted-foreground">As applicable</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span>Pickup Charges</span>
                        <span className="text-muted-foreground">As applicable</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span>Delivery Charges</span>
                        <span className="text-muted-foreground">As applicable</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-mateng/5 p-4 rounded-lg text-sm">
                    <p>
                      <strong>Note:</strong> Actual rates may vary based on parcel dimensions,
                      weight, and additional services requested. Please contact our customer
                      service for a detailed quote.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delhi-imphal" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-mateng" />
                  Delhi to Imphal Rates
                </CardTitle>
                <CardDescription>Cargo shipping rates from Delhi to Imphal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="bg-mateng/5 p-6 rounded-lg border border-mateng/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-mateng/10 p-3 rounded-full">
                        <Truck className="h-6 w-6 text-mateng" />
                      </div>
                      <h3 className="text-xl font-semibold">Base Shipping Rate</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center pb-3 border-b">
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-muted-foreground" />
                          <span>Base Rate per Kg</span>
                        </div>
                        <div className="flex items-center font-semibold text-lg">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          <span>150</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b">
                        <div className="flex items-center gap-2">
                          <Weight className="h-5 w-5 text-muted-foreground" />
                          <span>Handling Charge per Parcel</span>
                        </div>
                        <div className="flex items-center font-semibold text-lg">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          <span>120</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold mb-4">Additional Charges</h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span>Packing Charges</span>
                        <span className="text-muted-foreground">As applicable</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span>Pickup Charges</span>
                        <span className="text-muted-foreground">As applicable</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span>Delivery Charges</span>
                        <span className="text-muted-foreground">As applicable</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-mateng/5 p-4 rounded-lg text-sm">
                    <p>
                      <strong>Note:</strong> Actual rates may vary based on parcel dimensions,
                      weight, and additional services requested. Please contact our customer
                      service for a detailed quote.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DeliveryRates;
