import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class GetLocationsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;
}

export default GetLocationsDto;
