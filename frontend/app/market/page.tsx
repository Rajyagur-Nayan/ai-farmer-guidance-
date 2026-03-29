import React from 'react';
import Layout from '@/components/layout/Layout';
import MarketPrice from '@/components/MarketPrice';

export default function MarketPage() {
  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto">
        <MarketPrice />
      </div>
    </Layout>
  );
}
