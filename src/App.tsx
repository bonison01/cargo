
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateInvoice from "./pages/CreateInvoice";
import ViewInvoices from "./pages/ViewInvoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import Track from "./pages/Track";
import NotFound from "./pages/NotFound";
import { InvoiceProvider } from "./context/InvoiceContext";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Router>
      <InvoiceProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/invoices" element={<ViewInvoices />} />
          <Route path="/invoices/:id" element={<InvoiceDetails />} />
          <Route path="/track" element={<Track />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </InvoiceProvider>
    </Router>
  );
}

export default App;
