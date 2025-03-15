export type ApiResponse<T> = {
  status: boolean;
  message: string;
  entity?: T;
  error?: any;
};

export interface Pagination {
  page: number;
  pageSize: number;
  total: number | null;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
}
