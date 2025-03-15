import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location, PaginatedResponse } from '@big-wing/common';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('LocationsController', () => {
  let controller: LocationsController;
  let locationsService: LocationsService;

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

  const mockLocationsService = {
    getLocations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        {
          provide: LocationsService,
          useValue: mockLocationsService,
        },
      ],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
    locationsService = module.get<LocationsService>(LocationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLocations', () => {
    const getLocationsSuccessTest = async (): Promise<void> => {
      mockLocationsService.getLocations.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.getLocations({
        pageSize: 7,
        page: 1,
        search: '',
      });

      expect(result).toEqual({
        status: true,
        message: 'Locations fetched successfully',
        entity: mockPaginatedResponse,
      });
      expect(locationsService.getLocations).toHaveBeenCalledWith(1, 7, '');
    };

    const handleSearchQueryTest = async (): Promise<void> => {
      const searchTerm = 'LAX';
      const filteredResponse = {
        ...mockPaginatedResponse,
        data: [mockLocations[0]],
      };
      mockLocationsService.getLocations.mockResolvedValue(filteredResponse);

      const result = await controller.getLocations({
        pageSize: 7,
        page: 1,
        search: searchTerm,
      });

      expect(result).toEqual({
        status: true,
        message: 'Locations fetched successfully',
        entity: filteredResponse,
      });
      expect(locationsService.getLocations).toHaveBeenCalledWith(1, 7, searchTerm);
    };

    const defaultPageSizeTest = async (): Promise<void> => {
      mockLocationsService.getLocations.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.getLocations({
        page: 1,
      });

      expect(result).toEqual({
        status: true,
        message: 'Locations fetched successfully',
        entity: mockPaginatedResponse,
      });
      expect(locationsService.getLocations).toHaveBeenCalledWith(1, 7, undefined);
    };

    const handleServiceErrorsTest = async (): Promise<void> => {
      const errorMessage = 'Database error';
      mockLocationsService.getLocations.mockRejectedValue(new Error(errorMessage));

      await expect(controller.getLocations({})).rejects.toThrow(
        new HttpException(
          {
            message: 'Failed to fetch locations',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    };

    it('should return paginated locations successfully', getLocationsSuccessTest);
    it('should handle search query', handleSearchQueryTest);
    it('should use default pageSize when not provided', defaultPageSizeTest);
    it('should handle service errors', handleServiceErrorsTest);
  });
});
