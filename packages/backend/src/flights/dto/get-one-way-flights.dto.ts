import { IsDateString, IsInt, IsString, Min } from 'class-validator';

export class GetOneWayFlightsDto {
  @IsString()
  originCode: string;

  @IsString()
  destinationCode: string;

  @IsDateString()
  departureDate: string;

  @IsInt()
  @Min(1)
  pageSize: number;

  @IsInt()
  @Min(1)
  pageNumber: number;
} 