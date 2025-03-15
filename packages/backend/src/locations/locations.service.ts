import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/shared/services/supabase.service';
import { Location, PaginatedResponse } from '@big-wing/common';

@Injectable()
export class LocationsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getLocations(
    page?: number,
    pageSize?: number,
    search?: string,
  ): Promise<PaginatedResponse<Location>> {
    let searchColumns: Record<string, any>[] | undefined;

    if (search) {
      searchColumns = [
        {
          column: 'code',
          value: search,
        },
      ];
    }

    return this.supabase.select<Location>('locations', {
      search: searchColumns,
      page,
      pageSize,
      orderBy: { column: 'name', ascending: true },
    });
  }
}
