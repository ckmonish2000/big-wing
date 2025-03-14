
export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  code: string;
  name: string;
  logo: string;
}

export interface FlightPrice {
  amount: number;
  currency: string;
  cabin: 'economy' | 'premium_economy' | 'business' | 'first';
}

export interface Flight {
  id: string;
  airline: Airline;
  flightNumber: string;
  departure: {
    airport: Airport;
    time: string; // ISO string
    terminal?: string;
  };
  arrival: {
    airport: Airport;
    time: string; // ISO string
    terminal?: string;
  };
  duration: number; // in minutes
  prices: FlightPrice[];
  stops: number;
  connection?: {
    airport?: Airport;
    duration?: number; // in minutes
  }[];
}

export interface BookingPassenger {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  passport?: string;
  specialAssistance?: boolean;
}

export type TripType = 'one-way' | 'round-trip';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabin: 'economy' | 'premium_economy' | 'business' | 'first';
  tripType: TripType;
}

export interface Booking {
  id: string;
  outboundFlight: Flight;
  returnFlight?: Flight;
  passengers: BookingPassenger[];
  totalPrice: number;
  currency: string;
  bookingDate: string; // ISO string
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface FlightFilterOptions {
  airlines?: string[];
  maxPrice?: number;
  departureTime?: {
    start?: string; // HH:MM format
    end?: string;   // HH:MM format
  };
  maxStops?: number;
  duration?: number; // max duration in minutes
}

export type SortOption = 'price' | 'duration' | 'departure' | 'arrival';
export type SortDirection = 'asc' | 'desc';

export interface SortCriteria {
  option: SortOption;
  direction: SortDirection;
}
