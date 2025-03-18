import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  flightId: string;

  @IsString()
  @IsNotEmpty()
  routeId: string;

  @IsString()
  @IsNotEmpty()
  scheduleId: string;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @IsBoolean()
  @IsNotEmpty()
  isReturn: boolean;
}
