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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('flights')
@Controller('flights')
export class FlightsController {
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
    return this.flightsService.getRoundTripFlights(query);
  }

  @ApiOperation({ summary: 'Get flight details by ID' })
  @ApiParam({
    name: 'id',
    description: 'Flight ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns flight details',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Flight not found' })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getFlightById(@Param('id') id: string): Promise<any> {
    return this.flightsService.getFlightById(id);
  }
}
