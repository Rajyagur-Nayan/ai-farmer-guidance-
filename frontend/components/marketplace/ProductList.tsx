"use client";

import React, { useState, useEffect } from "react";
import { apiService } from "@/utils/api";
import ProductCard from "./ProductCard";
import { Loader2, Search, Leaf, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/Card";
import ProductDetail from "./ProductDetail";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProducts({ category, location });
      setProducts(data);
    } catch (error) {
      console.error("Market Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category, location]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6 animate-in fade-in duration-700">
        <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
        <p className="font-bold text-primary-900 uppercase tracking-widest animate-pulse">
          Loading Market Items...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* Filters Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between px-2 md:px-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-900 rounded-3xl flex items-center justify-center shadow-2xl">
            <ShoppingBag className="w-7 h-7 text-white" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-primary-900 leading-none">
              Farmer Marketplace
            </h4>
            <p className="text-sm font-semibold text-primary-400 mt-1">
              Buy and Sell Farm Products
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 p-2.5 bg-white rounded-[2rem] shadow-xl border border-medical-border w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent border-none font-black text-sm text-primary-900 focus:ring-4 focus:ring-primary-50 px-6 py-3 cursor-pointer rounded-2xl appearance-none pr-10 w-full sm:w-auto"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.2em",
            }}
          >
            <option value="">All Categories</option>
            <option value="crop">Crops</option>
            <option value="animal">Animals</option>
            <option value="tool">Tools</option>
            <option value="soil">Soil/Fertilizer</option>
          </select>
          <div className="hidden sm:block w-px h-8 bg-medical-border self-center opacity-40"></div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl hover:bg-primary-50/20 transition-colors w-full sm:w-auto">
            <Search className="w-4 h-4 text-primary-300" />
            <input
              type="text"
              placeholder="Filter by Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-primary-900 focus:ring-0 p-0 w-full sm:w-44"
            />
          </div>
        </div>
      </div>

      {/* List Grid */}
      {products.length === 0 ? (
        <Card className="p-8 sm:p-16 md:p-32 bg-medical-bg/20 border-dashed border-4 border-medical-border rounded-[2rem] md:rounded-[4rem] flex flex-col items-center justify-center text-center gap-6 md:gap-8 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-125 transition-transform">
            <Leaf className="w-12 h-12 text-primary-900" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900 mb-3">
              No products available
            </p>
            <p className="text-sm font-semibold text-primary-400">
              Check back later or add your own products for sale.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 px-2 md:px-0">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={(id) => setSelectedProductId(id)}
            />
          ))}
        </div>
      )}

      {/* Product Detail Modal Overlay */}
      {selectedProductId && (
        <ProductDetail
          id={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onPurge={() => {
            setSelectedProductId(null);
            loadProducts();
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
