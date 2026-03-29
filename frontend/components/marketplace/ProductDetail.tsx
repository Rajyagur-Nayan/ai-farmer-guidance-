"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/utils/api';
import { 
  X, 
  MapPin, 
  Tag, 
  Phone, 
  Trash2, 
  Loader2, 
  MessageCircle,
  Clock,
  Briefcase
} from 'lucide-react';

interface ProductDetailProps {
    id: number;
    onClose: () => void;
    onPurge: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ id, onClose, onPurge }) => {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [purging, setPurging] = useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await apiService.getProduct(id);
                setProduct(data);
            } catch (err) {
                console.error("Product Load Error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    const handlePurge = async () => {
        if (!window.confirm("Confirm deletion of this high-fidelity market record?")) return;
        setPurging(true);
        try {
            await apiService.deleteProduct(id);
            onPurge();
        } catch (err) {
            console.error("Purge Error:", err);
        } finally {
            setPurging(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] bg-primary-900/40 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
                <Loader2 className="w-20 h-20 text-white animate-spin" />
            </div>
        );
    }

    if (!product) return null;

    const displayImageUrl = product.image_url.startsWith('http') 
        ? product.image_url 
        : `http://127.0.0.1:8000${product.image_url}`;

    return (
        <div className="fixed inset-0 z-[100] bg-primary-900/60 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12 overflow-y-auto animate-in fade-in duration-500">
            <Card className="w-full max-w-6xl bg-white rounded-[4.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-700 h-fit lg:max-h-[85vh]">
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 w-16 h-16 rounded-full bg-medical-bg/80 backdrop-blur-md flex items-center justify-center text-primary-400 hover:bg-primary-900 hover:text-white transition-all z-20 shadow-xl"
                >
                    <X className="w-10 h-10" />
                </button>

                <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-visible">
                    {/* Left: Product Image */}
                    <div className="lg:w-1/2 min-h-[450px] lg:h-auto relative shrink-0">
                        <img 
                            src={displayImageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover lg:absolute lg:inset-0"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f80c?q=80&w=2000&auto=format&fit=crop';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent flex items-bottom p-12 lg:p-16">
                             <div className="mt-auto space-y-4">
                                <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                                    <Tag className="w-4 h-4 text-white" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">{product.category}</span>
                                </div>
                                <h2 className="text-6xl font-black italic text-white tracking-tighter uppercase leading-none">{product.name}</h2>
                             </div>
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="lg:w-1/2 p-12 lg:p-16 space-y-12 overflow-y-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 pb-12 border-b border-medical-border border-dashed">
                            <div className="space-y-2">
                                <p className="text-[12px] font-black text-primary-300 uppercase tracking-[0.3em] mb-1 pl-1 leading-none">Market Unit Price</p>
                                <p className="text-7xl font-black text-primary-900 italic tracking-tighter leading-none">₹{product.price.toLocaleString()}</p>
                            </div>
                            <div className="sm:text-right space-y-2">
                                <p className="text-[12px] font-black text-primary-300 uppercase tracking-[0.3em] mb-1 leading-none">Stock Registry</p>
                                <p className="text-3xl font-black text-primary-900 italic leading-none">{product.quantity || 1} Units</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="space-y-2 group">
                                <p className="text-[11px] font-black text-primary-200 uppercase tracking-[0.3em] flex items-center gap-3 group-hover:text-primary-400 transition-colors">
                                    <MapPin className="w-4 h-4" /> Geographic Node
                                </p>
                                <p className="text-xl font-black text-primary-900 italic uppercase tracking-tight">{product.location}</p>
                            </div>
                            <div className="space-y-2 group">
                                <p className="text-[11px] font-black text-primary-200 uppercase tracking-[0.3em] flex items-center gap-3 group-hover:text-primary-400 transition-colors">
                                    <Clock className="w-4 h-4" /> System Timestamp
                                </p>
                                <p className="text-xl font-black text-primary-900 italic uppercase tracking-tight">
                                    {new Date(product.created_at).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}
                                </p>
                            </div>
                        </div>

                        <div className="p-10 bg-medical-bg/20 rounded-[3.5rem] border border-primary-50 relative group overflow-hidden">
                            <p className="text-[11px] font-black text-primary-400 uppercase tracking-[0.4em] mb-5 leading-none opacity-60 relative z-10">Contextual Intelligence</p>
                            <p className="text-lg font-bold text-medical-textSecondary leading-relaxed italic relative z-10 tracking-tight">
                                {product.description || "No supplemental intelligence records provided for this entity metadata in the current market iteration."}
                            </p>
                            <Briefcase className="absolute -right-10 -bottom-10 w-40 h-40 opacity-[0.03] text-primary-900 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                        </div>

                        {/* Seller Action Panel */}
                        <div className="p-10 bg-primary-900 rounded-[4rem] text-white space-y-10 shadow-2xl relative overflow-hidden group border-8 border-primary-800">
                             <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                                <div className="space-y-3">
                                    <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] leading-none mb-1">Authenticated Seller</p>
                                    <h4 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{product.seller_name}</h4>
                                </div>
                                <div className="sm:text-right space-y-3">
                                    <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] leading-none mb-1">Communication Link</p>
                                    <h4 className="text-2xl font-black italic tracking-tighter leading-none">{product.contact}</h4>
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col sm:flex-row gap-6">
                                <a href={`tel:${product.contact}`} className="flex-1">
                                    <Button className="w-full h-20 rounded-3xl bg-white text-primary-900 shadow-2xl shadow-black/20 font-black italic uppercase tracking-widest text-sm hover:scale-[1.03] transition-all border-none">
                                        <Phone className="w-5 h-5 mr-3" /> Initialize Audio Sync
                                    </Button>
                                </a>
                                <Button className="flex-1 h-20 rounded-3xl bg-medical-green text-white shadow-2xl shadow-medical-green/20 font-black italic uppercase tracking-widest text-sm hover:scale-[1.03] transition-all border-none">
                                    <MessageCircle className="w-5 h-5 mr-3" /> Network Message
                                </Button>
                            </div>
                            
                            <Briefcase className="absolute -left-16 -top-16 w-64 h-64 opacity-[0.03] text-white pointer-events-none group-hover:scale-125 transition-transform duration-1000 rotate-12" />
                        </div>

                        {/* Admin Purge Action */}
                        <div className="pt-4 flex justify-end">
                            <button 
                                onClick={handlePurge}
                                disabled={purging}
                                className="flex items-center gap-2 text-[11px] font-black text-medical-error/40 uppercase tracking-[0.3em] hover:text-medical-error transition-colors"
                            >
                                {purging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                Purge Market Protocol Record
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProductDetail;
