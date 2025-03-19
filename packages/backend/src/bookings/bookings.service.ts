/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from 'src/shared/services/supabase.service';
import { throwHTTPErr } from 'src/utils';

type BookingType = {
  userId: string;
  flightId: string;
  routeId: string;
  scheduleId: string;
  bookingStatus: string;
  totalPrice: number;
  isReturn: boolean;
  createdAt: string;
};

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async createBooking(booking: BookingType): Promise<{
    status: boolean;
    entity: BookingType & { user: Partial<User> };
  }> {
    this.logger.log(`Creating booking: ${JSON.stringify(booking)}`);
    if (!booking?.scheduleId || !booking?.userId) {
      throwHTTPErr({
        message: 'Invalid booking data',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const bookingExists = await this.hasBooking(
      booking.scheduleId,
      booking.userId,
    );

    if (bookingExists) {
      throwHTTPErr({
        message: 'Booking already exists',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const { data, error } = await this.supabaseService.client
      .from('bookings')
      .insert(booking)
      .select()
      .single<BookingType>();

    const userData = await this.supabaseService.client.rpc(
      'get_user_details_by_id',
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        user_id: booking.userId,
      },
    );

    if (error) {
      throwHTTPErr({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return {
      status: true,
      entity: { ...data, user: userData?.data?.[0] },
    };
  }

  async hasBooking(scheduleId: string, userId: string): Promise<boolean> {
    this.logger.log(
      `Checking if booking exists for schedule ${scheduleId} and user ${userId}`,
    );
    const { data, error } = await this.supabaseService.client
      .from('bookings')
      .select('id')
      .eq('scheduleId', scheduleId)
      .eq('userId', userId)
      .in('bookingStatus', ['Pending', 'Confirmed'])
      .single();

    if (error && error.code !== 'PGRST116') {
      // Ignore not found error
      throwHTTPErr({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return !!data;
  }

  async getBookings(userId: string): Promise<any> {
    this.logger.log(`Getting all bookings for user ${userId}`);
    const { data, error } = await this.supabaseService.client
      .from('bookings')
      .select(
        `
        id,
        scheduleId,
        routeId,
        flightId,
        userId,
        totalPrice,
        isReturn,
        bookingStatus,
        createdAt,
        schedules(
        id,
        departureTime,
        arrivalTime,
        frequency
        ),
        routes(
          id,
          flightId,
          originId,
          origin:locations!originId(
            id,
            name,
            city,
            country,
            code
          ),
          destination:locations!destinationId(
            id,
            name,
            city,
            country,
            code
          ),
          isDirect
        ),
        flights(
          id,
          airlineId,
          airlines(
            id,
            name,
            code,
            logoUrl,
            country
          ),
          flightNumber,
          flightStatus,
          price
        )
      `,
      )
      .eq('userId', userId);

    if (error) {
      throwHTTPErr({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return data;
  }

  async getBooking(bookingId: string, userId: string): Promise<any> {
    this.logger.log(`Getting booking ${bookingId} for user ${userId}`);
    const { data, error } = await this.supabaseService.client
      .from('bookings')
      .select(
        `
        id,
        scheduleId,
        routeId,
        flightId,
        userId,
        totalPrice,
        isReturn,
        bookingStatus,
        createdAt,
        schedules(
        id,
        departureTime,
        arrivalTime,
        frequency
        ),
        routes(
          id,
          flightId,
          originId,
          origin:locations!originId(
            id,
            name,
            city,
            country,
            code
          ),
          destination:locations!destinationId(
            id,
            name,
            city,
            country,
            code
          ),
          isDirect
        ),
        flights(
          id,
          airlineId,
          airlines(
            id,
            name,
            code,
            logoUrl,
            country
          ),
          flightNumber,
          flightStatus
        )
      `,
      )
      .eq('id', bookingId)
      .eq('userId', userId)
      .single();

    const userData = await this.supabaseService.client.rpc(
      'get_user_details_by_id',
      {
        user_id: data?.userId,
      },
    );

    if (error) {
      throwHTTPErr({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return { ...data, user: userData?.data?.[0] };
  }

  async getBookingStatus(
    bookingId: string,
    token: string,
  ): Promise<{ bookingStatus: string }> {
    this.logger.log(`Getting booking status for booking ${bookingId}`);
    if (!token) {
      throwHTTPErr({
        message: 'Token is required',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    try {
      const userResponse =
        await this.supabaseService.client.auth.getUser(token);
      if (userResponse.error) {
        throwHTTPErr({
          message: 'Invalid token',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      const { data, error } = await this.supabaseService.client
        .from('bookings')
        .select('bookingStatus')
        .eq('id', bookingId)
        .eq('userId', userResponse.data.user.id)
        .single();

      if (error) {
        throwHTTPErr({
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }

      return { bookingStatus: data.bookingStatus };
    } catch (error: any) {
      throwHTTPErr({
        message: error.message,
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }
}
