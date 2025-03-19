import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class GetLocationsDto {
  @ApiProperty({
    description: 'Search term to filter locations',
    required: false,
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    example: 7,
    default: 7,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;
}

export default GetLocationsDto;
