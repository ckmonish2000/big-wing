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
  from: Flight[];
  return: Flight[];
}

export interface PaginatedRoundTripFlightsResponse {
  data: RoundTripFlights[];
  count: number;
}
