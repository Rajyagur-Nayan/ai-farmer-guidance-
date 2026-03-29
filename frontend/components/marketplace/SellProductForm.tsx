"use client";

import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/utils/api';
import { 
  ImageIcon, 
  Tag, 
  MapPin, 
  User, 
  Phone, 
  Loader2, 
  CheckCircle2, 
  X,
  PlusCircle,
  AlertCircle
} from 'lucide-react';

interface SellProductFormProps {
    onSuccess: () => void;
}

const SellProductForm: React.FC<SellProductFormProps> = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('crop');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [contact, setContact] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError("Only high-fidelity images are permitted.");
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !location || !image || !sellerName || !contact) {
            setError("All mandatory protocol fields must be populated.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('location', location);
        formData.append('seller_name', sellerName);
        formData.append('contact', contact);
        formData.append('image', image);
        if (quantity) formData.append('quantity', quantity);
        if (description) formData.append('description', description);

        try {
            await apiService.addProduct(formData);
            // Reset form
            setName('');
            setPrice('');
            setLocation('');
            setSellerName('');
            setContact('');
            setImage(null);
            setImagePreview(null);
            setIsVisible(false);
            onSuccess();
        } catch (err) {
            setError("Atmospheric data sync failed. Check database uplink.");
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) {
        return (
            <div className="flex justify-center px-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <Button 
                    onClick={() => setIsVisible(true)}
                    className="w-full md:w-auto px-16 h-24 rounded-[3rem] bg-primary-900 shadow-2xl shadow-primary-500/30 group hover:scale-110 hover:rotate-2 transition-all duration-500 border-none"
                    size="xl"
                >
                    <PlusCircle className="w-8 h-8 mr-4 group-hover:rotate-180 transition-transform duration-700 text-medical-warning" />
                    <span className="text-xl font-black italic tracking-[0.2em] uppercase text-white">List New Product</span>
                </Button>
            </div>
        );
    }

    return (
        <Card className="max-w-4xl mx-auto p-12 bg-white rounded-[4.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.1)] border-none relative overflow-hidden animate-in zoom-in-95 duration-700">
            {/* Background flourish */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -mt-32 -mr-32 opacity-60" />

            <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-10 right-10 w-14 h-14 rounded-full bg-medical-bg flex items-center justify-center text-primary-400 hover:bg-primary-900 hover:text-white transition-all shadow-sm z-10"
            >
                <X className="w-8 h-8" />
            </button>

            <div className="space-y-12 relative z-10">
                <div className="text-center space-y-4">
                    <h3 className="text-5xl font-black italic text-primary-900 tracking-tighter uppercase leading-none">Market Registration</h3>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary-400 opacity-60">Initialize High-Fidelity Trade Protocol</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Image Upload Area */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative w-full h-80 rounded-[3.5rem] border-4 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${imagePreview ? 'border-primary-500 bg-white' : 'border-primary-100 bg-medical-bg/20 hover:bg-white hover:border-primary-300 group'}`}
                    >
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-4">
                                    <ImageIcon className="w-12 h-12" />
                                    <p className="font-black italic uppercase tracking-widest text-xl">Change Asset Metadata</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center space-y-5">
                                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                                    <ImageIcon className="w-10 h-10 text-primary-300 group-hover:text-primary-600 transition-colors" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-primary-900 italic uppercase tracking-tight">Upload High-Fidelity Image*</p>
                                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mt-1">PNG, JPG or WebP (Max 10MB)</p>
                                </div>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-6">Product Alias*</label>
                            <div className="relative">
                                <Tag className="absolute left-7 top-7 w-6 h-6 text-primary-200" />
                                <input 
                                    type="text" 
                                    placeholder="e.g. Organic Cotton" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-16 pr-8 py-7 bg-medical-bg/40 rounded-[2.5rem] border-none focus:ring-4 focus:ring-primary-50 font-black italic text-lg transition-all text-primary-900 placeholder:opacity-30"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-6">Sector Category*</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-7 bg-medical-bg/40 rounded-[2.5rem] border-none focus:ring-4 focus:ring-primary-50 font-black italic text-lg transition-all text-primary-900 appearance-none pr-12"
                                style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1.4em'}}
                            >
                                <option value="crop">Crop Sector</option>
                                <option value="animal">Animal Livestock</option>
                                <option value="tool">Farm Machinery</option>
                                <option value="soil">Soil & Fertilizer</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-6">Market Price (₹)*</label>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-7 bg-medical-bg/40 rounded-[2.5rem] border-none focus:ring-4 focus:ring-primary-50 font-black italic text-lg transition-all text-primary-900"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-6">Geographic Node*</label>
                            <div className="relative">
                                <MapPin className="absolute left-7 top-7 w-6 h-6 text-primary-200" />
                                <input 
                                    type="text" 
                                    placeholder="City, State" 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-16 pr-8 py-7 bg-medical-bg/40 rounded-[2.5rem] border-none focus:ring-4 focus:ring-primary-50 font-black italic text-lg transition-all text-primary-900"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seller Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-medical-border border-dashed">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-6">Seller Identity*</label>
                            <div className="relative">
                                <User className="absolute left-7 top-7 w-6 h-6 text-primary-200" />
                                <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    value={sellerName}
                                    onChange={(e) => setSellerName(e.target.value)}
                                    className="w-full pl-16 pr-8 py-7 bg-medical-bg/40 rounded-[2.5rem] border-none focus:ring-4 focus:ring-primary-50 font-black italic text-lg transition-all text-primary-900"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-6">Communication Link*</label>
                            <div className="relative">
                                <Phone className="absolute left-7 top-7 w-6 h-6 text-primary-200" />
                                <input 
                                    type="text" 
                                    placeholder="Mobile Number" 
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    className="w-full pl-16 pr-8 py-7 bg-medical-bg/40 rounded-[2.5rem] border-none focus:ring-4 focus:ring-primary-50 font-black italic text-lg transition-all text-primary-900"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-400 pl-6">Contextual Description</label>
                        <textarea 
                            rows={4}
                            placeholder="Provide high-fidelity context about product status, quality, or usage..." 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-8 bg-medical-bg/40 rounded-[3rem] border-none focus:ring-4 focus:ring-primary-50 font-black italic text-lg transition-all text-primary-900 resize-none placeholder:opacity-30"
                        />
                    </div>

                    <div className="space-y-8">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-24 rounded-[3.5rem] bg-primary-900 text-white font-black italic uppercase tracking-[0.3em] text-2xl shadow-2xl shadow-primary-500/40 group hover:shadow-primary-500/60 hover:scale-[1.01] transition-all border-none"
                        >
                            {loading ? (
                                <Loader2 className="w-10 h-10 animate-spin" />
                            ) : (
                                <div className="flex items-center gap-5">
                                    <span>Initialize Market Listing</span>
                                    <CheckCircle2 className="w-10 h-10 group-hover:scale-110 transition-transform text-medical-green" />
                                </div>
                            )}
                        </Button>
                        
                        {error && (
                            <div className="flex items-center justify-center gap-3 p-5 bg-medical-error/5 rounded-3xl animate-shake border border-medical-error/10">
                                <AlertCircle className="w-5 h-5 text-medical-error" />
                                <p className="text-[11px] font-black text-medical-error uppercase tracking-widest">{error}</p>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </Card>
    );
};

export default SellProductForm;
