
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useInvoices } from "@/context/InvoiceContext";
import { formatDate, formatCurrency, formatConsignmentNumber } from "@/utils/helpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Search,
  FileText,
  Package,
  ArrowRight,
  Calendar,
  ChevronRight,
} from "lucide-react";

const InvoiceList: React.FC = () => {
  const { invoices, searchInvoices } = useInvoices();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState(invoices);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const results = searchInvoices(searchQuery);
    setFilteredInvoices(results);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredInvoices(invoices);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by consignment number, name, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            {searchQuery && (
              <Button type="button" variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </form>

          <div className="space-y-4">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-6">
                <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No invoices found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery
                    ? "Try a different search term or clear the search"
                    : "Create your first invoice to get started"}
                </p>
                {!searchQuery && (
                  <Button className="mt-4" asChild>
                    <Link to="/create-invoice">Create Invoice</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredInvoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    to={`/invoices/${invoice.id}`}
                    className="block"
                  >
                    <div className="group relative overflow-hidden rounded-lg border bg-background p-5 transition-all hover:shadow-md">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-blue-100/50 opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-950/10 dark:to-blue-900/20" />
                      
                      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium text-base inline-flex gap-2">
                              <span className="text-muted-foreground">
                                {formatConsignmentNumber(invoice.consignmentNumber)}
                              </span>
                            </span>
                          </div>
                          <p className="text-sm flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
                            <span className="text-muted-foreground/80">
                              {formatDate(invoice.date)}
                            </span>
                          </p>
                          <h3 className="font-medium flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                            <span className="truncate max-w-xs">{invoice.sender.name}</span>
                            <span className="hidden sm:inline text-muted-foreground">
                              <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                            <span className="truncate max-w-xs">{invoice.receiver.name}</span>
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 items-center">
                          <div className="flex items-center gap-2 mr-2">
                            <StatusBadge 
                              status={invoice.status} 
                              type="invoice"
                            />
                            <StatusBadge 
                              status={invoice.paymentStatus} 
                              type="payment"
                            />
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{invoice.originCity} to {invoice.destinationCity}</p>
                            <p className="font-medium">
                              {formatCurrency(invoice.charges.total)}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto shrink-0" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceList;
