export interface GroundingAttribution {
  uri: string;
  title: string;
}

export interface Flight {
  airline: string;
  price: number;
  bookingLink: string;
  description: string;
}

export interface Hotel {
  name: string;
  price: number;
  rating: number;
  bookingLink: string;
  description: string;
}

export interface Activity {
  name: string;
  price: number;
  bookingLink: string;
  description: string;
}

export interface Restaurant {
    name: string;
    priceRange: string;
    cuisine: string;
    bookingLink: string;
}

export interface TripPlan {
  planName: string;
  destination: string;
  totalCost: number;
  summary: string;
  budgetBreakdown: {
    flights: number;
    hotels: number;
    activities: number;
    food: number;
  };
  flight: Flight;
  hotel: Hotel;
  activities: Activity[];
  restaurants: Restaurant[];
  groundingAttributions: GroundingAttribution[];
}