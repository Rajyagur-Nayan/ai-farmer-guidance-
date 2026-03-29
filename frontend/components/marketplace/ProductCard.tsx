"use client";

import React from 'react';
import { Card } from '@/components/ui/Card';
import { MapPin, ArrowRight } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    location: string;
    image_url: string;
    seller_name: string;
}

interface ProductCardProps {
    product: Product;
    onViewDetails: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
    // API provides relative URL, ensure it points to backend (default localhost:8000)
    const displayImageUrl = product.image_url.startsWith('http') 
        ? product.image_url 
        : `http://127.0.0.1:8000${product.image_url}`;

    return (
        <Card className="group overflow-hidden bg-white rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500">
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden bg-medical-bg">
                <img 
                    src={displayImageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f80c?q=80&w=2000&auto=format&fit=crop';
                    }}
                />
                <div className="absolute top-4 right-4 bg-primary-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                    {product.category}
                </div>
                
                {/* Price Overlay tag */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md text-primary-900 px-6 py-3 rounded-2xl font-black italic text-xl shadow-xl">
                    ₹{product.price.toLocaleString()}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-6">
                <div className="space-y-3">
                    <h3 className="text-2xl font-black text-primary-900 italic tracking-tight leading-snug group-hover:text-primary-600 transition-colors uppercase truncate">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                         <MapPin className="w-3.5 h-3.5 text-primary-400" />
                         <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest truncate">{product.location}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-medical-border border-dashed">
                    <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-primary-300 uppercase tracking-widest leading-none">Seller Protocol</p>
                        <p className="text-sm font-black text-primary-900 italic leading-none truncate uppercase">
                            {product.seller_name}
                        </p>
                    </div>
                    <button 
                        onClick={() => onViewDetails(product.id)}
                        className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-900 group-hover:text-white transition-all shadow-inner"
                    >
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;
