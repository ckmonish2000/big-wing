import { apiGet, apiPost } from "./client";

export interface CreateBookingRequest {
  flightId: string;
  routeId: string;
  scheduleId: string;
  totalPrice: number;
  isReturn: boolean;
}

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
}

export const createBooking = async (
  bookingData: CreateBookingRequest
): Promise<{ status: boolean; entity: BookingResponse; error?: any }> => {
  const { flightId, routeId, scheduleId, totalPrice, isReturn } = bookingData;
  const response = await apiPost<{
    status: boolean;
    entity: BookingResponse;
    error?: any;
  }>("/bookings", {
    entity: {
      flightId,
      routeId,
      scheduleId,
      totalPrice,
      isReturn,
    },
  });
  return response;
};

export const hasBooking = async (scheduleId: string): Promise<boolean> => {
  const response = await apiGet<{ status: boolean; entity: boolean }>(
    `/bookings/verify`,
    {
      query: { scheduleId },
    }
  );
  return response.entity;
};

export const getBookings = async (): Promise<BookingResponse[]> => {
  const response = await apiGet<{ status: boolean; entity: BookingResponse[] }>(
    `/bookings`
  );
  return response.entity;
};

export const getBookingDetials = async ({
  bookingId,
}: {
  bookingId: string;
}): Promise<BookingResponse> => {
  const response = await apiGet<{ status: boolean; entity: BookingResponse }>(
    `/bookings/:bookingId`,
    {
      params: {
        bookingId,
      },
    }
  );
  return response.entity;
};
