import {
  IsOptional,
  IsString,
  IsNumber,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import 'reflect-metadata';

export class OrderByDto {
  @IsString()
  column: string;

  @IsOptional()
  @IsBoolean()
  ascending?: boolean;
}

export class BaseQueryDto {
  @IsOptional()
  @IsString()
  columns?: string;

  @IsOptional()
  @IsObject()
  filter?: Record<string, any>;

  @IsOptional()
  @IsObject()
  search?: Record<string, any>[];

  @IsOptional()
  @Type(() => OrderByDto)
  orderBy?: OrderByDto;
}

export class PaginatedQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;
}

export class RangeQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  range?: [number, number];
}
