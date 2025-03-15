import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PaginatedQueryDto, RangeQueryDto } from '../dto/query.dto';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') ?? '',
      this.configService.get<string>('SUPABASE_KEY') ?? '',
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  // Helper method for SELECT queries with range-based pagination
  async selectAll<T>(table: string, query: RangeQueryDto = {}) {
    let queryBuilder = this.supabase.from(table).select(query.columns || '*');

    if (query.filter) {
      Object.entries(query.filter).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value);
      });
    }

    if (query.range) {
      queryBuilder = queryBuilder.range(query.range[0], query.range[1]);
    }

    if (query.orderBy) {
      queryBuilder = queryBuilder.order(query.orderBy.column, {
        ascending: query.orderBy.ascending ?? true,
      });
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data as T[];
  }

  // Helper method for SELECT queries with page-based pagination
  async select<T>(table: string, query: PaginatedQueryDto = {}) {
    const { page = 1, pageSize = 10 } = query;

    let queryBuilder = this.supabase
      .from(table)
      .select(query.columns || '*', { count: 'exact' });

    if (query.filter) {
      Object.entries(query.filter).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value);
      });
    }

    if (query.search) {
      queryBuilder = queryBuilder.or(
        query.search
          .map(
            (searchItem) => `${searchItem.column}.ilike.%${searchItem.value}%`,
          )
          .join(','),
      );
    }

    if (query.orderBy) {
      queryBuilder = queryBuilder.order(query.orderBy.column, {
        ascending: query.orderBy.ascending ?? true,
      });
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    queryBuilder = queryBuilder.range(start, end);

    const { data, error, count } = await queryBuilder;

    if (error) throw error;
    return {
      data: data as T[],
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    };
  }

  // Helper method for INSERT queries
  async insert<T>(table: string, data: Partial<T> | Partial<T>[]) {
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data)
      .select();

    if (error) throw error;
    return result as T[];
  }

  // Helper method for UPDATE queries
  async update<T>(
    table: string,
    data: Partial<T>,
    filter: Record<string, any>,
  ) {
    const { data: result, error } = await this.supabase
      .from(table)
      .update(data)
      .match(filter)
      .select();

    if (error) throw error;
    return result as T[];
  }

  // Helper method for DELETE queries
  async delete(table: string, filter: Record<string, any>) {
    const { error } = await this.supabase.from(table).delete().match(filter);

    if (error) throw error;
    return true;
  }
}
