import { IsUUID, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { bookingStatusEnum } from '../interfaces/booking.interface';

export class CreateBookingDto {
  @IsUUID()
  flightId: string;

  @IsUUID()
  routeId: string;

  @IsUUID()
  scheduleId: string;

  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsEnum(bookingStatusEnum)
  @IsOptional()
  bookingStatus?: bookingStatusEnum;
}

export class CreateRoundTripBookingDto {
  @IsUUID()
  outboundFlightId: string;

  @IsUUID()
  outboundRouteId: string;

  @IsUUID()
  outboundScheduleId: string;

  @IsUUID()
  returnFlightId: string;

  @IsUUID()
  returnRouteId: string;

  @IsUUID()
  returnScheduleId: string;

  @IsNumber()
  @Min(0)
  totalPrice: number;
} 