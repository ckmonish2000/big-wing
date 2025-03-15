import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { SharedModule } from 'src/shared/shared.module';
import { LocationsController } from './locations.controller';

@Module({
  imports: [SharedModule],
  providers: [LocationsService],
  controllers: [LocationsController],
})
export class LocationsModule {}
