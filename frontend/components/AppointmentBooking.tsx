"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, User, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiService } from "@/utils/api";

interface AppointmentBookingProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalName: string;
  specialty?: string;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  isOpen,
  onClose,
  hospitalName,
  specialty,
}) => {
  const [formData, setFormData] = useState({
    patientName: "",
    date: "",
    time: "",
    reason: "",
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBooking = async () => {
    if (!formData.patientName || !formData.date || !formData.time) return;

    setIsBooking(true);
    try {
      const result = await apiService.bookAppointment({
        patient_name: formData.patientName,
        hospital_name: hospitalName,
        specialty: specialty,
        appointment_date: formData.date,
        appointment_time: formData.time,
        reason: formData.reason,
      });
      setBookingId(result.booking_id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-primary-50 flex items-center justify-between bg-primary-50/30">
          <div>
            <h3 className="text-xl font-semibold text-primary-900 leading-none">Schedule Appointment</h3>
            <p className="text-xs font-semibold text-primary-400 mt-2 uppercase tracking-widest">{hospitalName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-primary-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {bookingId ? (
            <div className="py-12 flex flex-col items-center text-center space-y-6 animate-in slide-in-from-bottom-10 duration-500">
              <div className="w-20 h-20 bg-medical-green/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-medical-green" />
              </div>
              <div>
                <h4 className="text-2xl font-semibold text-primary-900">Protocol Confirmed</h4>
                <p className="text-sm text-primary-400 mt-2">Your appointment has been successfully scheduled.</p>
                <div className="mt-6 px-6 py-3 bg-primary-50 rounded-2xl border border-primary-100">
                   <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300 block mb-1">Confirmation ID</span>
                   <span className="text-lg font-mono font-bold text-primary-900 tracking-wider">{bookingId}</span>
                </div>
              </div>
              <Button onClick={onClose} className="w-full rounded-2xl py-6">
                 Dismiss
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                   <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-primary-200" />
                   </div>
                   <Input 
                     placeholder="Patient Name"
                     value={formData.patientName}
                     onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                     className="pl-12 py-7 rounded-2xl border-primary-100 focus:ring-primary-500/10 placeholder:text-primary-200 font-bold"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                         <Calendar className="w-5 h-5 text-primary-200" />
                      </div>
                      <Input 
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="pl-12 py-7 rounded-2xl border-primary-100 font-bold"
                      />
                   </div>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                         <Clock className="w-5 h-5 text-primary-200" />
                      </div>
                      <Input 
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="pl-12 py-7 rounded-2xl border-primary-100 font-bold"
                      />
                   </div>
                </div>

                <div className="relative group">
                   <div className="absolute top-4 left-4 flex items-center pointer-events-none">
                      <FileText className="w-5 h-5 text-primary-200" />
                   </div>
                   <textarea 
                     placeholder="Brief reason or symptoms (Optional)"
                     value={formData.reason}
                     onChange={(e) => setFormData({...formData, reason: e.target.value})}
                     className="w-full pl-12 pr-4 py-4 min-h-[120px] rounded-2xl border border-primary-100 bg-white placeholder:text-primary-200 font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all"
                   />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button 
                   variant="outline" 
                   onClick={onClose} 
                   className="flex-1 py-7 rounded-2xl border-primary-100 text-primary-400 font-bold"
                >
                  Cancel
                </Button>
                <Button 
                   onClick={handleBooking} 
                   disabled={isBooking || !formData.patientName || !formData.date || !formData.time}
                   className="flex-1 py-7 rounded-2xl shadow-xl shadow-primary-500/20"
                >
                  {isBooking ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Confirm Order"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
