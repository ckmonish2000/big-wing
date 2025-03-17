export enum bookingStatusEnum {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  routeId: string;
  scheduleId: string;
  bookingStatus: bookingStatusEnum;
  totalPrice: number;
  createdAt: Date;
}

export interface RoundTripBooking {
  outboundBooking: Booking;
  returnBooking: Booking;
}
