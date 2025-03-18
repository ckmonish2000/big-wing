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

interface SSEMessage {
  data: string;
  id: string;
  type: string;
}

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

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

  @Get()
  @UseGuards(JwtAuthGuard)
  async getBookings(@Req() request: AuthReq) {
    const { sub } = request.user;
    console.log(sub, 'sub');
    const response = await this.bookingsService.getBookings(sub);
    return { status: true, entity: response };
  }

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
