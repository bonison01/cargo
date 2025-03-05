
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateInvoice from "./pages/CreateInvoice";
import ViewInvoices from "./pages/ViewInvoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import Track from "./pages/Track";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { InvoiceProvider } from "./context/InvoiceContext";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <Router>
      <AuthProvider>
        <InvoiceProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/create-invoice"
              element={
                <ProtectedRoute authRequired={false}>
                  <CreateInvoice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <ProtectedRoute authRequired={false}>
                  <ViewInvoices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <ProtectedRoute authRequired={false}>
                  <InvoiceDetails />
                </ProtectedRoute>
              }
            />
            <Route path="/track" element={<Track />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </InvoiceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
