import React from 'react';

const partners = [
    { 
        name: 'Skyscanner', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Skyscanner_Wordmark_Lockup_White_RGB.svg',
        url: 'https://www.skyscanner.net',
        className: 'h-8'
    },
    { 
        name: 'Booking.com', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo_white.svg',
        url: 'https://www.booking.com',
        className: 'h-10'
    },
    { 
        name: 'TripAdvisor', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Tripadvisor_lockup_horizontal_on_dark.svg',
        url: 'https://www.tripadvisor.com',
        className: 'h-10'
    },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-semibold mb-6">Our Trusted Partners</h3>
        <div className="flex justify-center items-center space-x-8 md:space-x-12 mb-8">
            {partners.map(partner => (
                <a 
                    key={partner.name}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${partner.name}`}
                    className={`${partner.className} opacity-80 hover:opacity-100 transition-opacity`}
                >
                    <img src={partner.logo} alt={`${partner.name} logo`} className="h-full" />
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
