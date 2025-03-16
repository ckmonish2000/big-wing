import { Controller, Get, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { GetOneWayFlightsDto } from './dto/get-one-way-flights.dto';
import { PaginatedFlightsResponse } from './interfaces/flight.interface';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get('one-way')
  async getOneWayFlights(
    @Query() query: GetOneWayFlightsDto,
  ): Promise<PaginatedFlightsResponse> {
    return this.flightsService.getOneWayFlights(query);
  }
}
