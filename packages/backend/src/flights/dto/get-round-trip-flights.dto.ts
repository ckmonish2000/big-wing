import { IsDateString, IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetRoundTripFlightsDto {
  @ApiProperty({
    description: 'Airport code for the origin location',
    example: 'LAX',
  })
  @IsString()
  originCode: string;

  @ApiProperty({
    description: 'Airport code for the destination location',
    example: 'JFK',
  })
  @IsString()
  destinationCode: string;

  @ApiProperty({
    description: 'Date of departure in ISO format',
    example: '2024-03-20',
  })
  @IsDateString()
  departureDate: string;

  @ApiProperty({
    description: 'Date of return in ISO format',
    example: '2024-03-25',
  })
  @IsDateString()
  returnDate: string;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  pageSize: number;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  pageNumber: number;
}
