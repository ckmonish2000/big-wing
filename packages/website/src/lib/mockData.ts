
import { Airport, Airline, Flight } from '@/types';

export const airlines: Airline[] = [
  {
    code: 'BA',
    name: 'British Airways',
    logo: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    code: 'AF',
    name: 'Air France',
    logo: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    code: 'LH',
    name: 'Lufthansa',
    logo: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    code: 'EK',
    name: 'Emirates',
    logo: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    code: 'DL',
    name: 'Delta Air Lines',
    logo: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=150&h=150&q=80',
  },
];

export const airports: Airport[] = [
  {
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'United States',
  },
  {
    code: 'LHR',
    name: 'Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
  },
  {
    code: 'CDG',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France',
  },
  {
    code: 'SFO',
    name: 'San Francisco International Airport',
    city: 'San Francisco',
    country: 'United States',
  },
  {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'United States',
  },
  {
    code: 'BER',
    name: 'Berlin Brandenburg Airport',
    city: 'Berlin',
    country: 'Germany',
  },
  {
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates',
  },
  {
    code: 'SYD',
    name: 'Sydney Airport',
    city: 'Sydney',
    country: 'Australia',
  },
  {
    code: 'HND',
    name: 'Haneda Airport',
    city: 'Tokyo',
    country: 'Japan',
  },
  {
    code: 'SIN',
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
  },
];

// Function to create a date in the future
const futureDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Helper to generate a random duration
const randomDuration = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Function to generate mock flights
export const generateMockFlights = (origin: string, destination: string, date: string, count = 10): Flight[] => {
  const flights: Flight[] = [];
  
  const originAirport = airports.find(a => a.code === origin) || airports[0];
  const destinationAirport = airports.find(a => a.code === destination) || airports[1];
  
  for (let i = 0; i < count; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNumber = `${airline.code}${Math.floor(Math.random() * 1000) + 100}`;
    const duration = randomDuration(120, 600); // 2-10 hours in minutes
    
    // Create departure time - spread throughout the day
    const departureTime = new Date(date);
    departureTime.setHours(Math.floor(i * 2.4)); // Spread departures across 24 hours
    departureTime.setMinutes(Math.floor(Math.random() * 60));
    
    // Calculate arrival time based on duration
    const arrivalTime = new Date(departureTime.getTime() + duration * 60000);
    
    // Determine if flight has stops
    const stops = Math.random() > 0.7 ? 1 : 0;
    
    const flight: Flight = {
      id: `FL-${i}-${origin}-${destination}`,
      airline,
      flightNumber,
      departure: {
        airport: originAirport,
        time: departureTime.toISOString(),
        terminal: `T${Math.floor(Math.random() * 5) + 1}`,
      },
      arrival: {
        airport: destinationAirport,
        time: arrivalTime.toISOString(),
        terminal: `T${Math.floor(Math.random() * 5) + 1}`,
      },
      duration,
      stops,
      prices: [
        {
          amount: Math.floor(Math.random() * 300) + 100,
          currency: 'USD',
          cabin: 'economy',
        },
        {
          amount: Math.floor(Math.random() * 500) + 300,
          currency: 'USD',
          cabin: 'premium_economy',
        },
        {
          amount: Math.floor(Math.random() * 1000) + 600,
          currency: 'USD',
          cabin: 'business',
        },
        {
          amount: Math.floor(Math.random() * 2000) + 1500,
          currency: 'USD',
          cabin: 'first',
        },
      ],
      connection: stops
        ? [
            {
              airport: airports[Math.floor(Math.random() * airports.length)],
              duration: randomDuration(60, 120),
            },
          ]
        : [],
    };
    
    flights.push(flight);
  }
  
  return flights;
};

// Generate some initial mock data
export const popularDestinations = [
  {
    id: 1,
    city: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&h=500&q=80',
    price: 299,
    code: 'CDG',
  },
  {
    id: 2,
    city: 'New York',
    country: 'United States',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&h=500&q=80',
    price: 399,
    code: 'JFK',
  },
  {
    id: 3,
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&h=500&q=80',
    price: 599,
    code: 'HND',
  },
  {
    id: 4,
    city: 'Dubai',
    country: 'United Arab Emirates',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&h=500&q=80',
    price: 499,
    code: 'DXB',
  },
  {
    id: 5,
    city: 'Sydney',
    country: 'Australia',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&h=500&q=80',
    price: 799,
    code: 'SYD',
  },
];
