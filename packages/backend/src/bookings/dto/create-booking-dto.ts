import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'The ID of the flight to book',
    example: 'flight-123',
  })
  @IsString()
  @IsNotEmpty()
  flightId: string;

  @ApiProperty({
    description: 'The ID of the route for this booking',
    example: 'route-456',
  })
  @IsString()
  @IsNotEmpty()
  routeId: string;

  @ApiProperty({
    description: 'The ID of the schedule for this booking',
    example: 'schedule-789',
  })
  @IsString()
  @IsNotEmpty()
  scheduleId: string;

  @ApiProperty({
    description: 'The total price of the booking',
    example: 299.99,
  })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty({
    description: 'Whether this is a return flight booking',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  isReturn: boolean;
}
