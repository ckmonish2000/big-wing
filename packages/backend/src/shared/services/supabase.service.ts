import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

  // Helper method for SELECT queries
  async select<T>(
    table: string,
    query: {
      columns?: string;
      filter?: Record<string, any>;
      range?: [number, number];
      orderBy?: { column: string; ascending?: boolean };
    } = {},
  ) {
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
