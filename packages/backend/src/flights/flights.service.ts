import { HttpStatus, Injectable } from '@nestjs/common';
import { GetOneWayFlightsDto } from './dto/get-one-way-flights.dto';
import { GetRoundTripFlightsDto } from './dto/get-round-trip-flights.dto';
import {
  Flight,
  PaginatedFlightsResponse,
  PaginatedRoundTripFlightsResponse,
  RoundTripFlights,
} from './interfaces/flight.interface';
import { SupabaseService } from 'src/shared/services/supabase.service';
import { throwHTTPErr } from 'src/utils';

@Injectable()
export class FlightsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getOneWayFlights(
    params: GetOneWayFlightsDto,
  ): Promise<PaginatedFlightsResponse> {
    const { originCode, destinationCode, departureDate, pageSize, pageNumber } =
      params;
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
}
