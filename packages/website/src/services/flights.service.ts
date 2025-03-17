import * as HttpClient from "@/services/client";
import { Flight, FlightSearchParams } from "@/types/flight";

export interface GetOneWayFlightsParams {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface PaginatedFlightsResponse {
  data: Flight[];
  count: number;
}

export const searchForFlights = async () => {
  const url = HttpClient.buildUrl("/protected");
  return HttpClient.apiGet(url);
};

export const getOneWayFlights = async (
  params: GetOneWayFlightsParams
): Promise<PaginatedFlightsResponse> => {
  // const url = HttpClient.buildUrl("/flights/one-way");
  return HttpClient.apiGet<PaginatedFlightsResponse>("/flights/one-way", {
    query: {
      ...params,
      pageSize: params.pageSize || 10,
      pageNumber: params.pageNumber || 1,
    },
  });
};
