import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Sse,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CreateBookingDto } from './dto/create-booking-dto';
import { BookingsService } from './bookings.service';
import { AuthReq } from 'src/types/AuthRequest';
import { Observable, interval } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

interface SSEMessage {
  data: string;
  id: string;
  type: string;
}

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  private readonly logger = new Logger(BookingsController.name);

  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
  })
  @Post()
  async createBooking(
    @Req() request: AuthReq,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    this.logger.log(
      `Creating booking for user ${request.user.sub} with data: ${JSON.stringify(
        createBookingDto,
      )}`,
    );
    return this.bookingsService.createBooking({
      ...createBookingDto,
      userId: request.user.sub,
      bookingStatus: 'Pending',
      createdAt: new Date().toISOString(),
    });
  }

  @ApiOperation({ summary: 'Check if user has a booking for a schedule' })
  @ApiResponse({
    status: 200,
    description: 'Returns whether user has booking',
  })
  @Get('has-booking')
  async hasBooking(
    @Req() request: AuthReq,
    @Query('scheduleId') scheduleId: string,
  ) {
    this.logger.log(
      `Checking booking existence for user ${request.user.sub} and schedule ${scheduleId}`,
    );
    return this.bookingsService.hasBooking(scheduleId, request.user.sub);
  }

  @ApiOperation({ summary: 'Get all bookings for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of bookings',
  })
  @Get()
  async getBookings(@Req() request: AuthReq): Promise<any> {
    this.logger.log(`Getting all bookings for user ${request.user.sub}`);
    return this.bookingsService.getBookings(request.user.sub);
  }

  @ApiOperation({ summary: 'Get booking details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns booking details',
  })
  @Get(':bookingId')
  async getBookingDetails(
    @Req() request: AuthReq,
    @Param('bookingId') bookingId: string,
  ): Promise<any> {
    this.logger.log(
      `Getting booking details for booking ${bookingId} and user ${request.user.sub}`,
    );
    return this.bookingsService.getBooking(bookingId, request.user.sub);
  }

  @ApiOperation({ summary: 'Stream booking status updates' })
  @ApiResponse({
    status: 200,
    description: 'Returns SSE stream of booking status',
  })
  @Sse(':bookingId/status')
  streamBookingStatus(
    @Req() request: AuthReq,
    @Param('bookingId') bookingId: string,
    @Query('token') token: string,
  ): Observable<SSEMessage> {
    this.logger.log(
      `Starting status stream for booking ${bookingId} and user ${request.user.sub}`,
    );
    return interval(5000).pipe(
      switchMap(() => this.bookingsService.getBookingStatus(bookingId, token)),
      map((status) => ({
        data: JSON.stringify(status),
        id: new Date().toISOString(),
        type: 'booking-status',
      })),
    );
  }
}
