import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Sse,
  HttpException,
  HttpStatus,
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
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

interface SSEMessage {
  data: string;
  id: string;
  type: string;
}

@ApiTags('bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'The booking has been successfully created',
    type: CreateBookingDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  @UseGuards(JwtAuthGuard)
  createBooking(
    @Req() request: AuthReq,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    const { sub } = request.user;
    const { flightId, routeId, scheduleId, totalPrice, isReturn } =
      createBookingDto;
    return this.bookingsService.createBooking({
      flightId,
      routeId,
      scheduleId,
      totalPrice,
      isReturn,
      userId: sub,
      bookingStatus: 'Pending',
      createdAt: new Date().toISOString(),
    });
  }

  @ApiOperation({
    summary: 'Check if user has a booking for a specific schedule',
  })
  @ApiQuery({
    name: 'scheduleId',
    required: true,
    description: 'ID of the schedule to check',
  })
  @ApiResponse({ status: 200, description: 'Returns booking status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/verify')
  @UseGuards(JwtAuthGuard)
  async hasBooking(
    @Req() request: AuthReq,
    @Query('scheduleId') scheduleId: string,
  ) {
    const { sub } = request.user;
    const response = await this.bookingsService.hasBooking(scheduleId, sub);
    return { status: true, entity: response };
  }

  @ApiOperation({ summary: 'Get all bookings for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns list of bookings' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getBookings(@Req() request: AuthReq) {
    const { sub } = request.user;
    console.log(sub, 'sub');
    const response = await this.bookingsService.getBookings(sub);
    return { status: true, entity: response };
  }

  @ApiOperation({ summary: 'Get details of a specific booking' })
  @ApiParam({
    name: 'bookingId',
    required: true,
    description: 'ID of the booking to retrieve',
  })
  @ApiResponse({ status: 200, description: 'Returns booking details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @Get(':bookingId')
  @UseGuards(JwtAuthGuard)
  async getBookingDetials(
    @Req() request: AuthReq,
    @Param('bookingId') bookingId: string,
  ) {
    const { sub } = request.user;
    const response = await this.bookingsService.getBooking(bookingId, sub);
    return { status: true, entity: response };
  }

  @ApiOperation({ summary: 'Stream booking status updates' })
  @ApiParam({
    name: 'bookingId',
    required: true,
    description: 'ID of the booking to stream status for',
  })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Authentication token',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns SSE stream of booking status updates',
  })
  @Sse(':bookingId/status-stream')
  streamBookingStatus(
    @Req() request: AuthReq,
    @Param('bookingId') bookingId: string,
    @Query('token') token: string,
  ): Observable<SSEMessage> {
    return interval(5000).pipe(
      switchMap(() => this.bookingsService.getBookingStatus(bookingId, token)),
      map((data) => ({
        data: JSON.stringify({ status: true, entity: data }),
        id: new Date().toISOString(),
        type: 'message',
      })),
    );
  }
}
