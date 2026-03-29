"use client";

import React from 'react';
import { Phone, Calendar, User, Star, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  location: string;
  available: boolean;
}

const DoctorList: React.FC = () => {
  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Anita Sharma',
      specialization: 'General Physician',
      experience: '12 years',
      rating: 4.8,
      location: 'Block A, Rural Clinic',
      available: true
    },
    {
      id: '2',
      name: 'Dr. Rajesh Kumar',
      specialization: 'Pediatrician',
      experience: '8 years',
      rating: 4.9,
      location: 'Main Hospital, Sector 4',
      available: true
    },
    {
      id: '3',
      name: 'Dr. Sunita Verma',
      specialization: 'Dermatologist',
      experience: '15 years',
      rating: 4.7,
      location: 'Community Health Center',
      available: false
    },
    {
      id: '4',
      name: 'Dr. Vikram Singh',
      specialization: 'Cardiologist',
      experience: '20 years',
      rating: 5.0,
      location: 'Zonal Medical Hub',
      available: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto p-4">
      {doctors.map((doctor) => (
        <Card key={doctor.id} className="hover:shadow-sm transition-all overflow-hidden group">
          <div className="p-6 flex flex-col sm:flex-row gap-6">
            {/* Doctor Info Section */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 font-bold text-xl">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-900 text-lg">{doctor.name}</h4>
                    <p className="text-medical-textSecondary font-medium text-sm">{doctor.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold text-yellow-700">{doctor.rating}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center gap-2 text-primary-400 text-sm font-medium">
                  <Star className="w-4 h-4 text-primary-200" />
                  <span>{doctor.experience} Experience</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-medical-green' : 'bg-red-400'}`}></span>
                <span className={`text-xs font-bold ${doctor.available ? 'text-medical-green' : 'text-red-500'}`}>
                  {doctor.available ? 'Available Today' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col sm:w-32 gap-3 justify-center">
              <Button 
                variant="primary"
                className="rounded-full"
                aria-label={`Call ${doctor.name}`}
              >
                <Phone className="w-5 h-5" />
                <span className="sm:hidden lg:inline text-sm">Call</span>
              </Button>
              <Button 
                variant="outline"
                className="rounded-full"
                aria-label={`Book ${doctor.name}`}
              >
                <Calendar className="w-5 h-5 text-primary-400" />
                <span className="sm:hidden lg:inline text-sm">Book</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DoctorList;
