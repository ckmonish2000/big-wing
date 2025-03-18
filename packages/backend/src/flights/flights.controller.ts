import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { GetOneWayFlightsDto } from './dto/get-one-way-flights.dto';
import { GetRoundTripFlightsDto } from './dto/get-round-trip-flights.dto';
import {
  PaginatedFlightsResponse,
  PaginatedRoundTripFlightsResponse,
} from '@big-wing/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { AuthReq } from 'src/types/AuthRequest';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get('one-way')
  async getOneWayFlights(
    @Query() query: GetOneWayFlightsDto,
  ): Promise<PaginatedFlightsResponse> {
    return this.flightsService.getOneWayFlights(query);
  }

  @Get('round-trip')
  async getRoundTripFlights(
    @Query() query: GetRoundTripFlightsDto,
  ): Promise<PaginatedRoundTripFlightsResponse> {
    return this.flightsService.getRoundTripFlights(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getFlightById(@Param('id') id: string): Promise<any> {
    return this.flightsService.getFlightById(id);
  }
}
