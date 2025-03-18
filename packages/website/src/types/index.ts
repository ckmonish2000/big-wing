import { RoundTripFlights } from "@big-wing/common";
import { User } from "@supabase/supabase-js";

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
  cabin: "economy" | "premium_economy" | "business" | "first";
}

export interface Flight {
  [x: string]: any;
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

export type TripType = "one-way" | "round-trip";

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabin: "economy" | "premium_economy" | "business" | "first";
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
  status: "confirmed" | "pending" | "cancelled";
}

export interface FlightFilterOptions {
  airlines?: string[];
  maxPrice?: number;
  departureTime?: {
    start?: string; // HH:MM format
    end?: string; // HH:MM format
  };
  maxStops?: number;
  duration?: number; // max duration in minutes
}

export type SortOption = "price" | "duration" | "departure" | "arrival";
export type SortDirection = "asc" | "desc";

export interface SortCriteria {
  option: SortOption;
  direction: SortDirection;
}

export interface GetOneWayFlightsParams {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface GetRoundTripFlightsParams {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate: string;
  pageSize?: number;
  pageNumber?: number;
}

export type FlightPage = {
  flights: Flight[];
  nextPage: number;
  hasMore: boolean;
};

export type RoundTripFlightPage = {
  flights: RoundTripFlights[];
  nextPage: number;
  hasMore: boolean;
};

export interface BookingResponse {
  id: string;
  flightId: string;
  routeId: string;
  scheduleId: string;
  totalPrice: number;
  isReturn: boolean;
  userId: string;
  bookingStatus: string;
  createdAt: string;
  schedules?: {
    id: string;
    departureTime: string;
    arrivalTime: string;
    frequency: string;
  };
  routes?: {
    id: string;
    flightId: string;
    originId: string;
    origin: {
      id: string;
      name: string;
      city: string;
      country: string;
      code: string;
    };
    destination: {
      id: string;
      name: string;
      city: string;
      country: string;
      code: string;
    };
    isDirect: boolean;
  };
  flights?: {
    id: string;
    airlineId: string;
    airlines: {
      id: string;
      name: string;
      code: string;
      logoUrl: string;
      country: string;
    };
    flightNumber: string;
    flightStatus: string;
  };
  user?: User;
}

