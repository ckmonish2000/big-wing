import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { GetOneWayFlightsDto } from './dto/get-one-way-flights.dto';
import { GetRoundTripFlightsDto } from './dto/get-round-trip-flights.dto';
import {
  PaginatedFlightsResponse,
  PaginatedRoundTripFlightsResponse,
} from '@big-wing/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('flights')
@Controller('flights')
export class FlightsController {
  private readonly logger = new Logger(FlightsController.name);

  constructor(private readonly flightsService: FlightsService) {}

  @ApiOperation({ summary: 'Get one-way flights based on search criteria' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of one-way flights',
  })
  @Get('one-way')
  async getOneWayFlights(
    @Query() query: GetOneWayFlightsDto,
  ): Promise<PaginatedFlightsResponse> {
    this.logger.log(
      `Processing one-way flights request with query: ${JSON.stringify(query)}`,
    );
    return this.flightsService.getOneWayFlights(query);
  }

  @ApiOperation({ summary: 'Get round-trip flights based on search criteria' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of round-trip flights',
  })
  @Get('round-trip')
  async getRoundTripFlights(
    @Query() query: GetRoundTripFlightsDto,
  ): Promise<PaginatedRoundTripFlightsResponse> {
    this.logger.log(
      `Processing round-trip flights request with query: ${JSON.stringify(query)}`,
    );
    return this.flightsService.getRoundTripFlights(query);
  }

  @ApiOperation({ summary: 'Get flight by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns flight details',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Flight ID',
  })
  @Get(':id')
  async getFlightById(@Param('id') id: string): Promise<any> {
    this.logger.log(`Processing get flight by ID request: ${id}`);
    return this.flightsService.getFlightById(id);
  }
}
