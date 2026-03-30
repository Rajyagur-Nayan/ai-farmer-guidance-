import React from "react";
import Layout from "@/components/layout/Layout";
import { MarketPrice } from "@/components/MarketPrice";

export default function MarketPage() {
  return (
    <Layout>
      <div className="max-w-[1700px] mx-auto px-4 md:px-8">
        <MarketPrice />
      </div>
    </Layout>
  );
}
