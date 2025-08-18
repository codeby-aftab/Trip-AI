import React from 'react';

const partners = [
    { 
        name: 'Skyscanner', 
        domain: 'skyscanner.net'
    },
    { 
        name: 'Booking.com', 
        domain: 'booking.com'
    },
    { 
        name: 'TripAdvisor', 
        domain: 'tripadvisor.com'
    },
    {
        name: 'Expedia',
        domain: 'expedia.com'
    },
    {
        name: 'Kayak',
        domain: 'kayak.com'
    }
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-semibold mb-6">Our Trusted Partners</h3>
        <div className="flex justify-center items-center flex-wrap gap-x-8 md:gap-x-12 gap-y-4 mb-8">
            {partners.map(partner => (
                <a 
                    key={partner.name}
                    href={`https://${partner.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${partner.name}`}
                    className="h-12 transform transition-transform duration-300 ease-in-out hover:scale-110"
                >
                    <img 
                        src={`https://logo.clearbit.com/${partner.domain}`} 
                        alt={`${partner.name} logo`} 
                        className="h-full w-auto transition-all duration-300" 
                    />
                </a>
            ))}
        </div>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto">
          Bookings are made through trusted partners. We may earn a small commission on bookings made through our links, at no extra cost to you. This helps us keep the AI running!
        </p>
        <p className="text-sm text-gray-500 mt-6">&copy; {new Date().getFullYear()} AI Trip Planner. All Rights Reserved.</p>
      </div>
    </footer>
  );
};