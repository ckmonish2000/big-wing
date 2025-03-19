import { HttpStatus, Injectable } from '@nestjs/common';
import { GetOneWayFlightsDto } from './dto/get-one-way-flights.dto';
import { GetRoundTripFlightsDto } from './dto/get-round-trip-flights.dto';
import {
  Flight,
  PaginatedFlightsResponse,
  PaginatedRoundTripFlightsResponse,
  RoundTripFlights,
} from '@big-wing/common';
import { SupabaseService } from 'src/shared/services/supabase.service';
import { throwHTTPErr } from 'src/utils';
import { Logger } from '@nestjs/common';

@Injectable()
export class FlightsService {
  private readonly logger = new Logger(FlightsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async getOneWayFlights(
    params: GetOneWayFlightsDto,
  ): Promise<PaginatedFlightsResponse> {
    this.logger.log(
      `Getting one-way flights with params: ${JSON.stringify(params)}`,
    );
    const { originCode, destinationCode, departureDate, pageSize, pageNumber } =
      params;
    console.log(params);
    const supabase = this.supabaseService.client;

    // Get total count
    const totalCount = await supabase.rpc('one_way_flight_count', {
      origincode: originCode,
      destinationcode: destinationCode,
      departuredate: departureDate,
    });

    // Get paginated flights
    const flightData = await supabase.rpc('one_way_flights', {
      origincodeparam: originCode,
      destinationcodeparam: destinationCode,
      departuredateparam: departureDate,
      pagesizeparam: pageSize,
      pagenumberparam: pageNumber,
    });

    if (flightData.error) {
      throwHTTPErr({
        message: flightData.error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return {
      data: flightData.data as Flight[],
      count: totalCount.data as number,
    };
  }

  async getRoundTripFlights(
    params: GetRoundTripFlightsDto,
  ): Promise<PaginatedRoundTripFlightsResponse> {
    this.logger.log(
      `Getting round-trip flights with params: ${JSON.stringify(params)}`,
    );
    const {
      originCode,
      destinationCode,
      departureDate,
      returnDate,
      pageSize,
      pageNumber,
    } = params;
    const supabase = this.supabaseService.client;

    // Get total count
    const totalCount = await supabase.rpc('round_trip_flights_count', {
      origincode: originCode,
      destinationcode: destinationCode,
      departuredate: departureDate,
      returndate: returnDate,
    });

    // Get paginated flights
    const flightData = await supabase.rpc('round_trip_flights', {
      origincodeparam: originCode,
      destinationcodeparam: destinationCode,
      departuredateparam: departureDate,
      returndateparam: returnDate,
      pagesizeparam: pageSize,
      pagenumberparam: pageNumber,
    });

    if (flightData.error) {
      throwHTTPErr({
        message: flightData.error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return {
      data: flightData.data as RoundTripFlights[],
      count: totalCount.data as number,
    };
  }

  async getFlightById(id: string): Promise<any> {
    this.logger.log(`Getting flight by ID: ${id}`);
    const { data, error } = await this.supabaseService.client
      .from('schedules')
      .select(
        `
        id,
        departureTime,
        arrivalTime,
        routes(
          id,
          isDirect,
          originId,
          destinationId,
          origin:locations!originId(name,code),
          destination:locations!destinationId(name,code),
          flights(
            id,
            flightNumber,
            price,
            airlines(
              name,
              code,
              logoUrl
            )
          )
        )
        `,
      )
      .eq('id', id)
      .single();

    if (error) {
      throwHTTPErr({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    const flight = data;
    return flight;
  }
}
