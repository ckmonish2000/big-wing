import { HttpStatus, Injectable } from '@nestjs/common';
import { GetOneWayFlightsDto } from './dto/get-one-way-flights.dto';
import {
  Flight,
  PaginatedFlightsResponse,
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
}
