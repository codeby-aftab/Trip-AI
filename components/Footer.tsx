
import React from 'react';

const partners = [
    { name: 'Skyscanner', logo: 'https://www.skyscanner.net/images/inspiration/ss-logo-stacked-white.png' },
    { name: 'Booking.com', logo: 'https://cf.bstatic.com/static/img/b25logo/booking-logo-retina/100a12a781e194ac5ced3a435851493f0b830d1d.png' },
    { name: 'TripAdvisor', logo: 'https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_on_light.svg' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-semibold mb-6">Our Trusted Partners</h3>
        <div className="flex justify-center items-center space-x-8 md:space-x-12 mb-8">
            {/* These are placeholder images for real logos */}
            <div className="h-8 filter grayscale hover:grayscale-0 transition-all brightness-0 invert">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Skyscanner_Logo.svg/2560px-Skyscanner_Logo.svg.png" alt="Skyscanner" className="h-full" />
            </div>
             <div className="h-10 filter grayscale hover:grayscale-0 transition-all brightness-0 invert">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Booking.com_logo.svg/2560px-Booking.com_logo.svg.png" alt="Booking.com" className="h-full" />
            </div>
             <div className="h-10 filter grayscale hover:grayscale-0 transition-all brightness-0 invert">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Tripadvisor_logo.svg/2560px-Tripadvisor_logo.svg.png" alt="TripAdvisor" className="h-full" />
            </div>
        </div>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto">
          Bookings are made through trusted partners. We may earn a small commission on bookings made through our links, at no extra cost to you. This helps us keep the AI running!
        </p>
        <p className="text-sm text-gray-500 mt-6">&copy; {new Date().getFullYear()} AI Trip Planner. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
