import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import GetLocationsDto from './dtos/get-locations-dto';
import { ApiResponse, Location, PaginatedResponse } from '@big-wing/common';
import { throwHTTPErr } from 'src/utils';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  async getLocations(
    @Query() query: GetLocationsDto,
  ): Promise<ApiResponse<PaginatedResponse<Location>>> {
    try {
      const { pageSize = 7, page, search } = query;
      const result = await this.locationsService.getLocations(
        page,
        pageSize,
        search,
      );
      return {
        status: true,
        message: 'Locations fetched successfully',
        entity: result,
      };
    } catch (error) {
      // implement logging
      throwHTTPErr({
        message: 'Failed to fetch locations',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
