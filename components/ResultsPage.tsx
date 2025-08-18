import React, { useState, useMemo } from 'react';
import type { TripPlan, Flight, Hotel, Activity, Restaurant, GroundingAttribution } from '../types';
import { AirplaneIcon } from './icons/AirplaneIcon';
import { HotelIcon } from './icons/HotelIcon';
import { CompassIcon } from './icons/CompassIcon';
import { StarIcon } from './icons/StarIcon';
import { RestaurantIcon } from './icons/RestaurantIcon';
import { formatCurrency } from '../utils/currency';

type Rates = { [key: string]: number };

interface ResultsPageProps {
  plans: TripPlan[];
  userBudget: number;
  currency: string;
  rates: Rates | null;
  onBack: () => void;
}

const Disclaimer: React.FC = () => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded-r-lg" role="alert">
        <p className="font-bold">🤖 AI-Generated Itinerary</p>
        <p>Please review and verify all details, including names, prices, and availability, on the booking sites before making any payments. This plan is a starting point for your adventure!</p>
    </div>
);


const ProgressBar: React.FC<{ breakdown: TripPlan['budgetBreakdown'] }> = ({ breakdown }) => (
    <div className="w-full bg-gray-200 rounded-full h-4 my-2 flex overflow-hidden">
        <div className="h-4 bg-sky-500" style={{ width: `${breakdown.flights}%` }} title={`Flights: ${breakdown.flights}%`}></div>
        <div className="h-4 bg-teal-500" style={{ width: `${breakdown.hotels}%` }} title={`Hotels: ${breakdown.hotels}%`}></div>
        <div className="h-4 bg-orange-500" style={{ width: `${breakdown.activities}%` }} title={`Activities: ${breakdown.activities}%`}></div>
        <div className="h-4 bg-yellow-500" style={{ width: `${breakdown.food}%` }} title={`Food: ${breakdown.food}%`}></div>
    </div>
);

const FlightCard: React.FC<{ flight: Flight; currency: string; rates: Rates | null }> = ({ flight, currency, rates }) => (
    <div className="p-4 bg-white rounded-lg flex justify-between items-center shadow-md border border-gray-100">
        <div>
            <p className="font-semibold text-lg text-gray-800">{flight.airline}</p>
            <p className="text-sm text-gray-600">{flight.description}</p>
        </div>
        <div className="text-right">
            <p className="font-bold text-xl text-sky-700">{formatCurrency(flight.price, currency, rates)}</p>
            <a href={flight.bookingLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-sky-600 hover:underline">Book Now</a>
        </div>
    </div>
);

const HotelCard: React.FC<{ hotel: Hotel; destination: string; currency: string; rates: Rates | null }> = ({ hotel, destination, currency, rates }) => {
    const imageUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(`${hotel.name},${destination}`)}`;
    return (
        <div className="p-4 bg-white rounded-lg flex items-center space-x-4 shadow-md border border-gray-100">
            <img 
                src={imageUrl} 
                alt={hotel.name} 
                className="w-24 h-24 object-cover rounded-md flex-shrink-0 bg-gray-200" 
                onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <div className="flex-grow">
                <h4 className="font-semibold text-lg text-gray-800">{hotel.name}</h4>
                <div className="flex items-center my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} isFilled={i < hotel.rating} className={`w-4 h-4 ${i < hotel.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                </div>
                 <p className="text-sm text-gray-600">{hotel.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="font-bold text-xl text-teal-700">{formatCurrency(hotel.price, currency, rates)}</p>
                <p className="text-xs text-gray-500 -mt-1">total for 5 nights</p>
                <a href={hotel.bookingLink} target="_blank" rel="noopener noreferrer" className="text-sm mt-2 inline-block font-medium text-teal-600 hover:underline">Book Now</a>
            </div>
        </div>
    );
};


const ActivityCard: React.FC<{ activity: Activity; destination: string; currency: string; rates: Rates | null }> = ({ activity, destination, currency, rates }) => {
    const imageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(`${activity.name},${destination}`)}`;
    return (
        <div className="p-4 bg-white rounded-lg flex flex-col h-full shadow-md border border-gray-100">
             <img 
                src={imageUrl} 
                alt={activity.name} 
                className="w-full h-32 object-cover rounded-md flex-shrink-0 bg-gray-200" 
                loading="lazy"
                onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <div className="flex-grow mt-3">
                <h4 className="font-semibold text-gray-800">{activity.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
            </div>
            <div className="text-right mt-3">
                <p className="font-bold text-lg text-orange-700">{formatCurrency(activity.price, currency, rates)}</p>
                <a href={activity.bookingLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-orange-600 hover:underline">Book Now</a>
            </div>
        </div>
    );
};

const RestaurantCard: React.FC<{ restaurant: Restaurant; destination: string; }> = ({ restaurant, destination }) => {
    const imageUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(`${restaurant.cuisine} food,${restaurant.name}`)}`;
    return (
        <div className="p-4 bg-white rounded-lg flex items-center space-x-4 shadow-md border border-gray-100">
            <img 
                src={imageUrl} 
                alt={restaurant.name} 
                className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-gray-200" 
                loading="lazy" 
                onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <div className="flex-grow">
                <h4 className="font-semibold text-gray-800">{restaurant.name}</h4>
                <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="font-bold text-lg text-yellow-700">{restaurant.priceRange}</p>
                <a href={restaurant.bookingLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-yellow-600 hover:underline">View / Reserve</a>
            </div>
        </div>
    );
};


export const ResultsPage: React.FC<ResultsPageProps> = ({ plans, userBudget, currency, rates, onBack }) => {
    const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
    const [showSources, setShowSources] = useState(false);
    const selectedPlan = plans[selectedPlanIndex];

    const allAttributions = useMemo(() => {
        const seen = new Set<string>();
        const uniqueAttributions: GroundingAttribution[] = [];
        for (const plan of plans) {
            for (const attr of plan.groundingAttributions) {
                if (!seen.has(attr.uri)) {
                    seen.add(attr.uri);
                    uniqueAttributions.push(attr);
                }
            }
        }
        return uniqueAttributions;
    }, [plans]);


    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Your Trip to {selectedPlan.destination}</h1>
                    <button onClick={onBack} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                        Plan a New Trip
                    </button>
                </div>
            </header>
            
            <main className="container mx-auto p-4 md:p-8">
                <Disclaimer />
                {/* Tabs */}
                <div className="mb-8 flex justify-center border-b border-gray-200">
                    {plans.map((plan, index) => (
                        <button 
                            key={index} 
                            onClick={() => setSelectedPlanIndex(index)}
                            className={`px-4 py-3 text-sm md:text-base font-semibold transition-colors duration-200 focus:outline-none ${selectedPlanIndex === index ? 'border-b-2 border-cyan-500 text-cyan-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {plan.planName}
                        </button>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <div className="pt-6 text-center">
                        <p className="text-gray-600">Total Estimated Cost</p>
                        <p className="text-5xl font-extrabold text-gray-900 my-2">{formatCurrency(selectedPlan.totalCost, currency, rates)}</p>
                        {selectedPlan.budgetBreakdown && <ProgressBar breakdown={selectedPlan.budgetBreakdown} />}
                        <div className="flex justify-center space-x-4 text-xs mt-2 text-gray-500">
                            <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-sky-500 mr-1.5"></span>Flights</span>
                            <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-teal-500 mr-1.5"></span>Hotels</span>
                            <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-orange-500 mr-1.5"></span>Activities</span>
                            <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5"></span>Food</span>
                        </div>
                        <p className="text-gray-700 mt-4 max-w-2xl mx-auto italic">{selectedPlan.summary}</p>
                    </div>
                </div>

                <div className="space-y-12">
                    {selectedPlan.flight && (
                        <section>
                            <h2 className="text-3xl font-bold mb-4 flex items-center text-gray-800"><AirplaneIcon className="w-7 h-7 mr-3 text-sky-600"/>Flight Details</h2>
                            <FlightCard flight={selectedPlan.flight} currency={currency} rates={rates} />
                        </section>
                    )}
                     {selectedPlan.hotel && (
                        <section>
                            <h2 className="text-3xl font-bold mb-4 flex items-center text-gray-800"><HotelIcon className="w-7 h-7 mr-3 text-teal-600"/>Accommodation (5 nights)</h2>
                            <HotelCard hotel={selectedPlan.hotel} destination={selectedPlan.destination} currency={currency} rates={rates} />
                        </section>
                     )}
                     {(selectedPlan.activities?.length || 0) > 0 && (
                        <section>
                            <h2 className="text-3xl font-bold mb-4 flex items-center text-gray-800"><CompassIcon className="w-7 h-7 mr-3 text-orange-600"/>Recommended Activities</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {selectedPlan.activities.map((activity, index) => <ActivityCard key={index} activity={activity} destination={selectedPlan.destination} currency={currency} rates={rates} />)}
                            </div>
                        </section>
                     )}
                     {(selectedPlan.restaurants?.length || 0) > 0 && (
                        <section>
                            <h2 className="text-3xl font-bold mb-4 flex items-center text-gray-800"><RestaurantIcon className="w-7 h-7 mr-3 text-yellow-600"/>Dining Recommendations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {selectedPlan.restaurants.map((resto, index) => <RestaurantCard key={index} restaurant={resto} destination={selectedPlan.destination} />)}
                            </div>
                        </section>
                     )}
                    {(allAttributions.length || 0) > 0 && (
                        <section>
                            <div className="text-center border-t border-gray-200 pt-8 mt-12">
                                <button
                                    onClick={() => setShowSources(!showSources)}
                                    className="inline-flex items-center text-gray-600 hover:text-gray-900 font-semibold text-sm transition-colors focus:outline-none"
                                >
                                    {showSources ? 'Hide Information Sources' : 'Show Information Sources'}
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-1 transition-transform duration-200 ${showSources ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showSources && (
                                    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border text-left max-w-4xl mx-auto">
                                        <h3 className="text-lg font-bold mb-3 text-gray-800">Sources</h3>
                                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                                            {allAttributions.map(attr => (
                                                <li key={attr.uri}>
                                                    <a href={attr.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{attr.title}</a>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-xs text-gray-400 mt-4">This trip plan was generated using real-time information from Google Search.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};