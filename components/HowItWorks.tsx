
import React from 'react';
import { WalletIcon } from './icons/WalletIcon';
import { AirplaneIcon } from './icons/AirplaneIcon';
import { CompassIcon } from './icons/CompassIcon';

const StepCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
        <div className="mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-sky-100 to-cyan-200 text-cyan-700">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
          <p className="text-lg text-gray-600 mt-2">Plan your perfect trip in three simple steps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <StepCard 
            icon={<WalletIcon className="h-8 w-8"/>} 
            title="1. Enter Details" 
            description="Just tell us your destination and budget. It's that simple."
          />
          <StepCard 
            icon={<AirplaneIcon className="h-8 w-8"/>} 
            title="2. AI Generates" 
            description="Our AI finds the best flights, hotels, and activities for you."
          />
          <StepCard 
            icon={<CompassIcon className="h-8 w-8"/>} 
            title="3. Book Your Trip" 
            description="Get direct links to book everything and start your adventure."
          />
        </div>
      </div>
    </section>
  );
};
