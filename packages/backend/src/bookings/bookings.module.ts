import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [SharedModule],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
