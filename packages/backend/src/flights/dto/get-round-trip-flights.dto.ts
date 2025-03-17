import { IsDateString, IsInt, IsString, Min } from 'class-validator';

export class GetRoundTripFlightsDto {
  @IsString()
  originCode: string;

  @IsString()
  destinationCode: string;

  @IsDateString()
  departureDate: string;

  @IsDateString()
  returnDate: string;

  @IsInt()
  @Min(1)
  pageSize: number;

  @IsInt()
  @Min(1)
  pageNumber: number;
} 