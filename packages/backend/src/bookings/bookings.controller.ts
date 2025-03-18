import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CreateBookingDto } from './dto/create-booking-dto';
import { BookingsService } from './bookings.service';
import { AuthReq } from 'src/types/AuthRequest';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
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
  async hasBooking(
    @Req() request: AuthReq,
    @Query('scheduleId') scheduleId: string,
  ) {
    const { sub } = request.user;
    const response = await this.bookingsService.hasBooking(scheduleId, sub);
    return { status: true, entity: response };
  }

  @Get()
  async getBookings(@Req() request: AuthReq) {
    const { sub } = request.user;
    console.log(sub, 'sub');
    const response = await this.bookingsService.getBookings(sub);
    return { status: true, entity: response };
  }

  
  @Get(':bookingId')
  async getBookingDetials(
    @Req() request: AuthReq,
    @Param('bookingId') bookingId: string,
  ) {
    const { sub } = request.user;
    const response = await this.bookingsService.getBooking(bookingId, sub);
    return { status: true, entity: response };
  }
}
