import { apiGet, apiPost } from "./client";
import { indexedDBHelper } from "@/lib/indexedDB";

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
  try {
    // Try to fetch from API first
    const response = await apiGet<{ status: boolean; entity: BookingResponse[] }>(
      `/bookings`
    );
    
    // If successful, cache the data
    await indexedDBHelper.saveBookings(response.entity);
    return response.entity;
  } catch (error: unknown) {
    // If API fails, try to get from IndexedDB
    try {
      const cachedBookings = await indexedDBHelper.getBookings();
      if (cachedBookings.length > 0) {
        return cachedBookings;
      }
    } catch (dbError: unknown) {
      console.error('Failed to fetch from IndexedDB:', dbError);
    }
    throw error;
  }
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
