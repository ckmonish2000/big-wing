export type ApiResponse<T> = {
  status: boolean;
  message: string;
  entity?: T;
  error?: any;
};

export interface Pagination {
  page: number;
  pageSize: number;
  total: number | null;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
}
export interface Flight {
  flightId: string;
  flightNumber: string;
  airlineName: string;
  airlineCode: string;
  routeId: string;
  originName: string;
  originCode: string;
  destinationName: string;
  destinationCode: string;
  scheduleId: string;
  departureTime: string;
  arrivalTime: string;
  frequency: string;
  price: number;
  flightStatus: string;
}

export interface PaginatedFlightsResponse {
  data: Flight[];
  count: number;
}

export interface RoundTripFlights {
  from: Flight;
  return: Flight;
}

export interface PaginatedRoundTripFlightsResponse {
  data: RoundTripFlights[];
  count: number;
}

export interface Booking {
  id?: string;
  userId: string;
  flightId: string;
  routeId: string;
  scheduleId: string;
  bookingStatus: "Confirmed" | "Cancelled" | "Pending";
  totalPrice: number;
  isReturn: boolean;
  createdAt: string;
  Flight?: Flight;
  Route?: any;
  Schedule?: any;
}
