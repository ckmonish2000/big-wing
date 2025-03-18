import * as HttpClient from "@/services/client";
import { GetOneWayFlightsParams, GetRoundTripFlightsParams } from "@/types";
import {
  Flight,
  PaginatedFlightsResponse,
  PaginatedRoundTripFlightsResponse,
} from "@big-wing/common";

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

export const getRoundTripFlights = async (
  params: GetRoundTripFlightsParams
): Promise<PaginatedRoundTripFlightsResponse> => {
  return HttpClient.apiGet<PaginatedRoundTripFlightsResponse>(
    "/flights/round-trip",
    {
      query: {
        ...params,
        pageSize: params.pageSize || 10,
        pageNumber: params.pageNumber || 1,
      },
    }
  );
};

export const getFlightById = async (id: string): Promise<Flight> => {
  return HttpClient.apiGet<Flight>(`/flights/${id}`);
};
