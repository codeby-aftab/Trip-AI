import React, { useState, useEffect } from 'react';
import { HERO_BACKGROUNDS, DESTINATION_SUGGESTIONS, SUPPORTED_CURRENCIES } from '../constants';

interface HeroSectionProps {
  onGenerate: (origin: string, destination: string, budget: number, currency: string) => void;
  isLoading: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGenerate, isLoading }) => {
  const [bgIndex, setBgIndex] = useState(0);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState(2000);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % HERO_BACKGROUNDS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin.trim() && destination.trim() && budget > 0) {
      onGenerate(origin, destination, budget, currency);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {HERO_BACKGROUNDS.map((bg, index) => (
        <div
          key={bg}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${bg})`, opacity: index === bgIndex ? 1 : 0, transform: `scale(${index === bgIndex ? 1.05 : 1})`, transition: 'opacity 1s ease-in-out, transform 6s ease-in-out' }}
        />
      ))}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          Your Next Adventure, Reimagined
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          Plan Your Entire Trip in Seconds – Hotels, Flights & Fun Included.
        </p>

        <form 
          onSubmit={handleSubmit}
          className="w-full max-w-3xl p-6 md:p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-left mb-2">Your Location</label>
              <input
                id="origin"
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g., New York, USA"
                required
                className="w-full bg-white/20 border border-white/30 rounded-lg py-3 px-4 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all placeholder-gray-300"
              />
            </div>
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-left mb-2">Destination</label>
              <input
                id="destination"
                type="text"
                list="destinations"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Paris, France"
                required
                className="w-full bg-white/20 border border-white/30 rounded-lg py-3 px-4 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all placeholder-gray-300"
              />
              <datalist id="destinations">
                {DESTINATION_SUGGESTIONS.map(d => <option key={d} value={d} />)}
              </datalist>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-left mb-2">Your Budget</label>
              <div className="flex">
                <input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  placeholder="e.g., 2000"
                  required
                  min="100"
                  className="w-2/3 bg-white/20 border border-white/30 rounded-l-lg py-3 px-4 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all placeholder-gray-300 appearance-none"
                  style={{ MozAppearance: 'textfield' }}
                />
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-1/3 bg-white/20 border-t border-b border-r border-white/30 rounded-r-lg py-3 px-2 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all"
                >
                  {SUPPORTED_CURRENCIES.map(c => (
                    <option key={c.code} value={c.code} className="text-black">{c.code}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold py-3 px-6 bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 rounded-lg shadow-lg hover:shadow-cyan-400/50 transform hover:scale-105 transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Your Adventure...
              </div>
            ) : (
              "Generate My Trip"
            )}
          </button>
        </form>
        <p className="mt-8 text-sm text-gray-300">Join 25,000+ happy travelers planning smarter trips with AI.</p>
      </div>
    </div>
  );
};
