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

  async getFlightById(id: string): Promise<any> {
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
    // {
    //   flightId: flight.id,
    //   flightNumber: flight.flightNumber,
    //   airlineName: flight.airlines.name,
    //   airlineCode: flight.airlines.code,
    //   airlineLogo: flight.airlines.logoUrl,
    //   routeId: flight.routes.id,
    //   originName: flight.routes.originLocation.name,
    //   originCode: flight.routes.originLocation.code,
    //   destinationName: flight.routes.destinationLocation.name,
    //   destinationCode: flight.routes.destinationLocation.code,
    //   scheduleId: flight.routes.schedules[0].id,
    //   departureTime: flight.routes.schedules[0].departureTime,
    //   arrivalTime: flight.routes.schedules[0].arrivalTime,
    //   frequency: flight.routes.schedules[0].frequency,
    //   price: flight.price,
    //   flightStatus: flight.flightStatus
    // };
  }
  
}
