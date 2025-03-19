import { IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetOneWayFlightsDto {
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
    description: 'Number of items per page',
    example: '10',
  })
  @IsString()
  pageSize: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: '1',
  })
  @IsString()
  pageNumber: string;
}
