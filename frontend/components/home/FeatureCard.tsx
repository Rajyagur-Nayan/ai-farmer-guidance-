import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    route: string;
    accentColor: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
    title, 
    description, 
    icon: Icon, 
    route, 
    accentColor 
}) => {
    return (
        <Link href={route} className="block group h-full">
            <Card className="h-full p-6 transition-all duration-500 flex flex-col justify-between overflow-hidden relative group/card">
                
                {/* Background flourish */}
                <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-20 transition-all duration-1000 group-hover/card:scale-150 ${accentColor}`} />

                <div className="space-y-6 relative z-10">
                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-transform duration-500 group-hover/card:scale-110 shadow-inner ${accentColor}`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-primary-900 leading-snug">
                            {title}
                        </h3>
                        <p className="text-base text-medical-textSecondary leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="pt-8 flex items-center justify-between relative z-10 border-t border-medical-border border-dashed mt-8">
                    <span className="text-sm font-semibold text-primary-500 group-hover/card:text-primary-900 transition-colors">
                        Open Feature
                    </span>
                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 group-hover/card:bg-primary-900 group-hover/card:text-white transition-all">
                        <ArrowRight className="w-5 h-5 group-hover/card:translate-x-1 transition-transform" />
                    </div>
                </div>
            </Card>
        </Link>
    );
};
