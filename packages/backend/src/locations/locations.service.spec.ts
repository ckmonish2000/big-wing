import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { Location, PaginatedResponse } from '@big-wing/common';
import { SupabaseService } from 'src/shared/services/supabase.service';

describe('LocationsService', () => {
  let service: LocationsService;
  let supabaseService: SupabaseService;

  const mockLocations: Location[] = [
    {
      id: '1',
      name: 'Los Angeles International Airport',
      code: 'LAX',
      city: 'Los Angeles',
      country: 'United States',
    },
    {
      id: '2',
      name: 'John F. Kennedy International Airport',
      code: 'JFK',
      city: 'New York',
      country: 'United States',
    },
  ];

  const mockPaginatedResponse: PaginatedResponse<Location> = {
    data: mockLocations,
    pagination: {
      page: 1,
      pageSize: 7,
      total: 2,
      totalPages: 1,
    },
  };

  const mockSupabaseService = {
    select: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLocations', () => {
    const getLocationsTest = async (): Promise<void> => {
      mockSupabaseService.select.mockResolvedValue(mockPaginatedResponse);

      const result = await service.getLocations(1, 7);

      expect(result).toEqual(mockPaginatedResponse);
      expect(supabaseService.select).toHaveBeenCalledWith('locations', {
        page: 1,
        pageSize: 7,
        orderBy: { column: 'name', ascending: true },
        search: undefined,
      });
    };

    const getLocationsWithSearchTest = async (): Promise<void> => {
      const searchTerm = 'LAX';
      mockSupabaseService.select.mockResolvedValue({
        ...mockPaginatedResponse,
        data: [mockLocations[0]],
      });

      const result = await service.getLocations(1, 7, searchTerm);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].code).toBe('LAX');
      expect(supabaseService.select).toHaveBeenCalledWith('locations', {
        page: 1,
        pageSize: 7,
        orderBy: { column: 'name', ascending: true },
        search: [{ column: 'code', value: searchTerm }],
      });
    };

    const handleEmptySearchTest = async (): Promise<void> => {
      mockSupabaseService.select.mockResolvedValue(mockPaginatedResponse);

      const result = await service.getLocations(1, 7, '');

      expect(result).toEqual(mockPaginatedResponse);
      expect(supabaseService.select).toHaveBeenCalledWith('locations', {
        page: 1,
        pageSize: 7,
        orderBy: { column: 'name', ascending: true },
        search: undefined,
      });
    };

    const handleUndefinedPaginationTest = async (): Promise<void> => {
      mockSupabaseService.select.mockResolvedValue(mockPaginatedResponse);

      const result = await service.getLocations();

      expect(result).toEqual(mockPaginatedResponse);
      expect(supabaseService.select).toHaveBeenCalledWith('locations', {
        page: undefined,
        pageSize: undefined,
        orderBy: { column: 'name', ascending: true },
        search: undefined,
      });
    };

    it(
      'should return paginated locations without search',
      getLocationsTest,
    );
    it(
      'should return paginated locations with search',
      getLocationsWithSearchTest,
    );
    it(
      'should handle empty search term',
      handleEmptySearchTest,
    );
    it(
      'should handle undefined pagination parameters',
      handleUndefinedPaginationTest,
    );
  });
});
