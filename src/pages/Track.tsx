
import React from "react";
import Header from "@/components/Header";
import { ConsignmentTracker } from "@/components/tracking";

const Track: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <ConsignmentTracker />
      </main>
    </div>
  );
};

export default Track;
