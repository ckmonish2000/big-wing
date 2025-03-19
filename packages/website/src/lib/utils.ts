import { BookingResponse, Flight } from "@/types";
import { Booking } from "@big-wing/common";
import { User } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { differenceInMinutes, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const filghtDataMaker = (flightData) => {
  const routes = flightData.routes;
  const flight = routes.flights;
  const airlines = flight.airlines;
  const destination = routes.destination;
  const origin = routes.origin;
  return {
    id: flight.id,
    flightNumber: flight.flightNumber,
    scheduleId: flightData.id,
    routeId: routes.id,
    airline: {
      name: airlines.name,
      code: airlines.code,
      logo: airlines.logoUrl,
    },
    departure: {
      time: flightData.departureTime,
      airport: {
        name: origin.name,
        code: origin.code,
        city: origin.city,
        country: origin.country,
      },
    },
    arrival: {
      time: flightData.arrivalTime,
      airport: {
        name: destination.name,
        code: destination.code,
        city: destination.city,
        country: destination.country,
      },
    },
    duration: differenceInMinutes(
      parseISO(flightData.arrivalTime),
      parseISO(flightData.departureTime)
    ),
    stops: 0,
    prices: [
      {
        amount: flight.price,
        currency: "USD",
        cabin: "economy",
      },
    ],
  };
};

export const ticketMaker = (booking: BookingResponse): Flight => {
  return {
    id: booking.flights?.id || "",
    airline: {
      code: booking.flights?.airlines?.code || "",
      name: booking.flights?.airlines?.name || "",
      logo: booking.flights?.airlines?.logoUrl || "",
    },
    flightNumber: booking.flights?.flightNumber || "",
    departure: {
      airport: {
        code: booking?.routes?.origin?.code || "",
        name: booking.routes?.origin?.name || "",
        city: booking.routes?.origin?.city || "",
        country: booking.routes?.origin?.country || "",
      },
      time: booking.schedules?.departureTime || "",
      terminal: undefined,
    },
    arrival: {
      airport: {
        code: booking.routes?.destination?.code || "",
        name: booking.routes?.destination?.name || "",
        city: booking.routes?.destination?.city || "",
        country: booking.routes?.destination?.country || "",
      },
      time: booking.schedules?.arrivalTime || "",
      terminal: undefined,
    },
    duration: 0, // This would need to be calculated from departure and arrival times
    prices: [
      {
        amount: booking.totalPrice,
        currency: "USD",
        cabin: "economy",
      },
    ],
    stops: booking.routes?.isDirect ? 0 : 1,
    connection: booking.routes?.isDirect ? undefined : [],
  };
};

export const bookingMaker = (
  booking: BookingResponse
): Booking & {
  user?: User;
} => {
  return {
    id: booking.id,
    userId: booking.userId,
    flightId: booking.flightId,
    routeId: booking.routeId,
    scheduleId: booking.scheduleId,
    bookingStatus: booking.bookingStatus as
      | "Confirmed"
      | "Cancelled"
      | "Pending",
    totalPrice: booking.totalPrice,
    isReturn: booking.isReturn,
    createdAt: booking.createdAt,
    user: booking.user || {} as User,
  };
};
