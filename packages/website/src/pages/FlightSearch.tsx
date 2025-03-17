import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ArrowLeft, ArrowRight, Filter, CalendarIcon, Clock, Plane, ArrowUpDown } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Separator } from "@/components/atoms/separator";
import { Checkbox } from "@/components/atoms/checkbox";
import { Badge } from "@/components/atoms/badge";
import { Slider } from "@/components/atoms/slider";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import { Label } from "@/components/atoms/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/atoms/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Input } from "@/components/atoms/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Skeleton } from "@/components/atoms/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { generateMockFlights, airlines } from "@/lib/mockData";
import { Flight, FlightSearchParams, FlightFilterOptions, SortCriteria, SortOption, SortDirection } from "@/types/flight";
import { getOneWayFlights, getRoundTripFlights } from "@/services/flights.service";
import { useAuth } from "@/hooks/use-auth";

// Helper function to format minutes to hours and minutes
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const FlightCard = ({ flight, cabin, isReturn }: { flight: Flight; cabin: string; isReturn?: boolean }) => {
  console.log(flight, 'flightflightflightflight')
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const cabinPrice = flight?.prices?.[0];
  const departureTime = (flight?.departure.time || '');
  const arrivalTime = (flight?.arrival.time || '');
  const handleSelectFlight = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    navigate(`/payment?outboundScheduleId=${flight.scheduleId}`, { state: { flight } });
  };

  return (
    <>
      <Card className={`mb-4 hover:shadow-md transition-shadow cursor-pointer ${isReturn ? 'border-l-4 border-primary' : ''}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col justify-between h-full space-y-4">
            {isReturn && (
              <div>
                <Badge variant="outline">Return Flight</Badge>
              </div>
            )}

            <div className="flex flex-col space-y-4">
              {/* Airline Info */}
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full overflow-hidden flex-shrink-0">
                  <img src={flight?.airline.logo} alt={flight?.airline.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-sm sm:text-base">{flight?.airline.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{flight?.flightNumber}</p>
                </div>
              </div>

              {/* Flight Times & Route */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between">
                {/* Departure */}
                <div className="text-left sm:text-center mb-2 sm:mb-0">
                  <p className="text-base sm:text-lg font-bold">{departureTime}</p>
                  <p className="text-xs sm:text-sm">{flight?.departure.airport.code}</p>
                </div>

                {/* Flight Duration & Stops */}
                <div className="flex-grow mx-0 sm:mx-4 my-4 sm:my-0">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">{formatDuration(flight?.duration || 0)}</p>
                    <p className="text-xs text-muted-foreground">
                      {flight?.stops === 0 ? "Direct" : `${flight?.stops} stop${flight?.stops > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <div className="relative w-full h-[2px] bg-gray-300 my-2">
                    <div className="absolute top-1/2 left-0 w-2 h-2 bg-primary rounded-full transform -translate-y-1/2"></div>
                    {flight?.stops > 0 && (
                      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                    <div className="absolute top-1/2 right-0 w-2 h-2 bg-primary rounded-full transform -translate-y-1/2"></div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="text-right sm:text-center">
                  <p className="text-base sm:text-lg font-bold">{arrivalTime}</p>
                  <p className="text-xs sm:text-sm">{flight?.arrival.airport.code}</p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex justify-between items-center sm:justify-end sm:space-x-4 pt-2 sm:pt-0">
                <p className="text-xl sm:text-2xl font-bold">${cabinPrice?.amount}</p>
                <Button size="sm" className="w-24 sm:w-auto" onClick={handleSelectFlight}>
                  Select
                </Button>
              </div>
            </div>

            {/* Connection Info */}
            {flight?.stops > 0 && flight?.connection && (
              <div className="pt-3 border-t">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Connecting in {flight?.connection[0].airport?.city} ({flight?.connection[0].airport?.code})
                  {flight.connection[0].duration && ` · ${formatDuration(flight.connection[0].duration)} layover`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>
              Please sign in to proceed with your booking.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button onClick={signInWithGoogle} className="w-full">
              <img src="/icons/google.svg" width={24} height={24} className="mr-2" />
              Sign in with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const LoadingSkeleton = () => (
  <>
    {[1, 2, 3].map((i) => (
      <Card key={i} className="mb-4">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Skeleton className="w-12 h-12 rounded-full mr-4" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <div className="text-center">
                <Skeleton className="h-6 w-16 mb-1 mx-auto" />
                <Skeleton className="h-4 w-10 mx-auto" />
              </div>

              <div className="hidden md:flex flex-col items-center mx-4">
                <Skeleton className="h-4 w-20 mb-1" />
                <div className="relative w-32 h-[2px] bg-gray-200 my-2"></div>
                <Skeleton className="h-4 w-16" />
              </div>

              <div className="text-center">
                <Skeleton className="h-6 w-16 mb-1 mx-auto" />
                <Skeleton className="h-4 w-10 mx-auto" />
              </div>
            </div>

            <div className="flex flex-col items-end mt-4 md:mt-0 w-full md:w-auto">
              <Skeleton className="h-8 w-24 mb-1" />
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </>
);

type FlightPage = {
  flights: Flight[];
  nextPage: number;
  hasMore: boolean;
};

type RoundTripFlight = {
  outbound: Flight;
  return: Flight;
};

type RoundTripFlightPage = {
  flights: RoundTripFlight[];
  nextPage: number;
  hasMore: boolean;
};

type QueryResult = FlightPage | RoundTripFlightPage;
type FlightResult = Flight | RoundTripFlight;

function isRoundTripFlight(flight: FlightResult): flight is RoundTripFlight {
  return 'outbound' in flight && 'return' in flight;
}

function isRoundTripFlightPage(page: QueryResult): page is RoundTripFlightPage {
  return 'flights' in page && page.flights.length > 0 && 'outbound' in page.flights[0];
}

const FlightSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filterOptions, setFilterOptions] = useState<FlightFilterOptions>({
    airlines: [],
    maxPrice: 2000,
    maxStops: 2,
  });
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>({
    option: 'price',
    direction: 'asc',
  });
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(null);

  // Get search params from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const searchParamsObj = {
      origin: params.get('origin') || '',
      destination: params.get('destination') || '',
      departureDate: params.get('departureDate') || '',
      returnDate: params.get('returnDate') || undefined,
      passengers: Number(params.get('passengers')) || 1,
      cabin: (params.get('cabin') as 'economy' | 'premium_economy' | 'business' | 'first') || 'economy',
      tripType: (params.get('tripType') as 'one-way' | 'round-trip') || 'one-way',
    };

    setSearchParams(searchParamsObj);
  }, [location.search, navigate]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<QueryResult>({
    queryKey: ['flights', searchParams, filterOptions],
    queryFn: async ({ pageParam = 1 }) => {
      if (!searchParams?.origin || !searchParams?.destination || !searchParams?.departureDate) {
        throw new Error('Missing required search parameters');
      }

      if (searchParams.tripType === 'round-trip' && searchParams.returnDate) {
        const response = await getRoundTripFlights({
          originCode: searchParams.origin,
          destinationCode: searchParams.destination,
          departureDate: new Date(new Date(searchParams.departureDate).getTime() + 24 * 60 * 60 * 1000).toISOString(),
          returnDate: new Date(new Date(searchParams.returnDate).getTime() + 24 * 60 * 60 * 1000).toISOString(),
          pageNumber: pageParam as number,
          pageSize: 10,
        });

        return {
          flights: response.data.map(pair => ({
            outbound: {
              id: pair.from.flightId,
              flightNumber: pair.from.flightNumber,
              scheduleId: pair.from.scheduleId,
              airline: {
                name: pair.from.airlineName,
                code: pair.from.airlineCode,
                logo: pair.from.airlineLogo
              },
              departure: {
                time: pair.from.departureTime,
                airport: {
                  name: pair.from.originName,
                  code: pair.from.originCode,
                  city: pair.from.originCity || '',
                  country: pair.from.originCountry || ''
                }
              },
              arrival: {
                time: pair.from.arrivalTime,
                airport: {
                  name: pair.from.destinationName,
                  code: pair.from.destinationCode,
                  city: pair.from.destinationCity || '',
                  country: pair.from.destinationCountry || ''
                }
              },
              duration: Math.round((new Date(pair.from.arrivalTime).getTime() - new Date(pair.from.departureTime).getTime()) / 1000 / 60),
              stops: 0,
              prices: [{
                amount: pair.from.price,
                currency: 'USD',
                cabin: searchParams.cabin
              }]
            },
            return: {
              id: pair.return.flightId,
              flightNumber: pair.return.flightNumber,
              scheduleId: pair.return.scheduleId,
              airline: {
                name: pair.return.airlineName,
                code: pair.return.airlineCode,
                logo: pair.return.airlineLogo
              },
              departure: {
                time: pair.return.departureTime,
                airport: {
                  name: pair.return.originName,
                  code: pair.return.originCode,
                  city: pair.return.originCity || '',
                  country: pair.return.originCountry || ''
                }
              },
              arrival: {
                time: pair.return.arrivalTime,
                airport: {
                  name: pair.return.destinationName,
                  code: pair.return.destinationCode,
                  city: pair.return.destinationCity || '',
                  country: pair.return.destinationCountry || ''
                }
              },
              duration: Math.round((new Date(pair.return.arrivalTime).getTime() - new Date(pair.return.departureTime).getTime()) / 1000 / 60),
              stops: 0,
              prices: [{
                amount: pair.return.price,
                currency: 'USD',
                cabin: searchParams.cabin
              }]
            }
          })),
          nextPage: (pageParam as number) + 1,
          hasMore: ((pageParam as number) * 10) < response.count,
        } as RoundTripFlightPage;
      }

      const response = await getOneWayFlights({
        originCode: searchParams.origin,
        destinationCode: searchParams.destination,
        departureDate: new Date(new Date(searchParams.departureDate).getTime() + 24 * 60 * 60 * 1000).toISOString(),
        pageNumber: pageParam as number,
        pageSize: 10,
      });

      return {
        flights: response.data.map(flight => ({
          id: flight.flightId,
          flightNumber: flight.flightNumber,
          scheduleId: flight.scheduleId,
          airline: {
            name: flight.airlineName,
            code: flight.airlineCode,
            logo: flight.airlineLogo
          },
          departure: {
            time: flight.departureTime,
            airport: {
              name: flight.originName,
              code: flight.originCode,
              city: flight.originCity || '',
              country: flight.originCountry || ''
            }
          },
          arrival: {
            time: flight.arrivalTime,
            airport: {
              name: flight.destinationName,
              code: flight.destinationCode,
              city: flight.destinationCity || '',
              country: flight.destinationCountry || ''
            }
          },
          duration: Math.round((new Date(flight.arrivalTime).getTime() - new Date(flight.departureTime).getTime()) / 1000 / 60),
          stops: 0,
          prices: [{
            amount: flight.price,
            currency: 'USD',
            cabin: searchParams.cabin
          }]
        })),
        nextPage: (pageParam as number) + 1,
        hasMore: ((pageParam as number) * 10) < response.count,
      } as FlightPage;
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
    enabled: !!searchParams?.origin && !!searchParams?.destination && !!searchParams?.departureDate,
    initialPageParam: 1,
  });

  const allFlights: FlightResult[] = data?.pages.flatMap<FlightResult>(page => {
    if (isRoundTripFlightPage(page)) {
      return page.flights;
    }
    return (page as FlightPage).flights;
  }) || [];

  // Apply filters and sorting
  const filteredFlights = allFlights.filter(flight => {
    return true
    // Filter by airlines
    if (filterOptions.airlines?.length > 0) {
      if (isRoundTripFlight(flight)) {
        return filterOptions.airlines.includes(flight.outbound.airline.code) &&
          filterOptions.airlines.includes(flight.return.airline.code);
      }
      return filterOptions.airlines.includes(flight.airline.code);
    }

    // Filter by max price
    if (filterOptions.maxPrice) {
      if (isRoundTripFlight(flight)) {
        const outboundPrice = flight.outbound.prices.find(p => p.cabin === searchParams?.cabin)?.amount || 0;
        const returnPrice = flight.return.prices.find(p => p.cabin === searchParams?.cabin)?.amount || 0;
        return (outboundPrice + returnPrice) <= filterOptions.maxPrice;
      }
      const price = flight.prices.find(p => p.cabin === searchParams?.cabin)?.amount || 0;
      return price <= filterOptions.maxPrice;
    }

    // Filter by number of stops
    if (filterOptions.maxStops !== undefined) {
      if (isRoundTripFlight(flight)) {
        return flight.outbound.stops <= filterOptions.maxStops &&
          flight.return.stops <= filterOptions.maxStops;
      }
      return flight.stops <= filterOptions.maxStops;
    }

    return true;
  }).sort((a, b) => {
    const { option, direction } = sortCriteria;
    const multiplier = direction === 'asc' ? 1 : -1;

    switch (option) {
      case 'price': {
        const priceA = isRoundTripFlight(a)
          ? (a.outbound.prices.find(p => p.cabin === searchParams?.cabin)?.amount || 0) +
          (a.return.prices.find(p => p.cabin === searchParams?.cabin)?.amount || 0)
          : a.prices.find(p => p.cabin === searchParams?.cabin)?.amount || 0;
        const priceB = isRoundTripFlight(b)
          ? (b.outbound.prices.find(p => p.cabin === searchParams?.cabin)?.amount || 0) +
          (b.return.prices.find(p => p.cabin === searchParams?.cabin)?.amount || 0)
          : b.prices.find(p => p.cabin === searchParams?.cabin)?.amount || 0;
        return (priceA - priceB) * multiplier;
      }
      case 'duration': {
        const durationA = isRoundTripFlight(a)
          ? a.outbound.duration + a.return.duration
          : a.duration;
        const durationB = isRoundTripFlight(b)
          ? b.outbound.duration + b.return.duration
          : b.duration;
        return (durationA - durationB) * multiplier;
      }
      case 'departure': {
        const departureA = isRoundTripFlight(a)
          ? new Date(a.outbound.departure.time).getTime()
          : new Date(a.departure.time).getTime();
        const departureB = isRoundTripFlight(b)
          ? new Date(b.outbound.departure.time).getTime()
          : new Date(b.departure.time).getTime();
        return (departureA - departureB) * multiplier;
      }
      case 'arrival': {
        const arrivalA = isRoundTripFlight(a)
          ? new Date(a.return.arrival.time).getTime()
          : new Date(a.arrival.time).getTime();
        const arrivalB = isRoundTripFlight(b)
          ? new Date(b.return.arrival.time).getTime()
          : new Date(b.arrival.time).getTime();
        return (arrivalA - arrivalB) * multiplier;
      }
      default:
        return 0;
    }
  });

  if (!searchParams) return null;

  const cabinLabel = searchParams.cabin.replace('_', ' ');
  const departure = searchParams.departureDate ? parseISO(searchParams.departureDate) : null;
  const arrival = searchParams.returnDate ? parseISO(searchParams.returnDate) : null;

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Flight Search Results</h1>
      </div>

      <div className="bg-sky-50 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">From</Badge>
            <span className="font-medium">{searchParams.origin}</span>
          </div>

          <ArrowRight className="h-4 w-4 text-muted-foreground" />

          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">To</Badge>
            <span className="font-medium">{searchParams.destination}</span>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2 hidden md:block" />

          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {departure ? format(departure, 'MMM d, yyyy') : ''}
              {arrival ? ` - ${format(arrival, 'MMM d, yyyy')}` : ''}
            </span>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2 hidden md:block" />

          <div className="flex items-center">
            <Badge className="capitalize">{cabinLabel}</Badge>
          </div>

          <div className="flex items-center">
            <Badge variant="outline">{searchParams.passengers} Passenger{searchParams.passengers > 1 ? 's' : ''}</Badge>
          </div>

          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => navigate('/')}
          >
            Modify Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setFilterOptions({
                  airlines: [],
                  maxPrice: 2000,
                  maxStops: 2,
                })}>
                  Reset
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Airlines</h3>
                  <div className="space-y-2">
                    {airlines.map((airline) => (
                      <div key={airline.code} className="flex items-center space-x-2">
                        <Checkbox
                          id={`airline-${airline.code}`}
                          checked={(filterOptions.airlines || []).includes(airline.code)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilterOptions(prev => ({
                                ...prev,
                                airlines: [...(prev.airlines || []), airline.code],
                              }));
                            } else {
                              setFilterOptions(prev => ({
                                ...prev,
                                airlines: (prev.airlines || []).filter(c => c !== airline.code),
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={`airline-${airline.code}`}>{airline.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="space-y-4">
                    <div className="pt-2">
                      <Slider
                        value={[filterOptions.maxPrice || 2000]}
                        max={2000}
                        step={50}
                        onValueChange={(value) => setFilterOptions(prev => ({
                          ...prev,
                          maxPrice: value[0],
                        }))}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span>$0</span>
                      <span>${filterOptions.maxPrice}</span>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <p className="text-muted-foreground mb-4 sm:mb-0">
              {filteredFlights.length} {filteredFlights.length === 1 ? 'flight' : 'flights'} found
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Select
                value={sortCriteria.option}
                onValueChange={(value) => setSortCriteria(prev => ({
                  ...prev,
                  option: value as SortOption,
                }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="departure">Departure Time</SelectItem>
                  <SelectItem value="arrival">Arrival Time</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setSortCriteria(prev => ({
                  ...prev,
                  direction: prev.direction === 'asc' ? 'desc' : 'asc'
                }))}
              >
                {sortCriteria.direction === 'asc' ? 'Ascending' : 'Descending'}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button className="sm:hidden" variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Refine your flight search results
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Airlines</h3>
                      <div className="space-y-2">
                        {airlines.map((airline) => (
                          <div key={airline.code} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-airline-${airline.code}`}
                              checked={(filterOptions.airlines || []).includes(airline.code)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilterOptions(prev => ({
                                    ...prev,
                                    airlines: [...(prev.airlines || []), airline.code],
                                  }));
                                } else {
                                  setFilterOptions(prev => ({
                                    ...prev,
                                    airlines: (prev.airlines || []).filter(c => c !== airline.code),
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`mobile-airline-${airline.code}`}>{airline.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Price Range</h3>
                      <div className="space-y-4">
                        <div className="pt-2">
                          <Slider
                            value={[filterOptions.maxPrice || 2000]}
                            max={2000}
                            step={50}
                            onValueChange={(value) => setFilterOptions(prev => ({
                              ...prev,
                              maxPrice: value[0],
                            }))}
                          />
                        </div>
                        <div className="flex justify-between">
                          <span>$0</span>
                          <span>${filterOptions.maxPrice}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Stops</h3>
                      <RadioGroup
                        value={String(filterOptions.maxStops || 2)}
                        onValueChange={(value) => setFilterOptions(prev => ({
                          ...prev,
                          maxStops: parseInt(value),
                        }))}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="mobile-r1" />
                          <Label htmlFor="mobile-r1">Non-stop only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="mobile-r2" />
                          <Label htmlFor="mobile-r2">Up to 1 stop</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2" id="mobile-r3" />
                          <Label htmlFor="mobile-r3">Up to 2 stops</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="pt-4">
                      <Button onClick={() => setFilterOptions({
                        airlines: [],
                        maxPrice: 2000,
                        maxStops: 2,
                      })}>Reset Filters</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center">
                <Plane className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Error loading flights</h3>
                <p className="text-muted-foreground mb-4">
                  Please try again later.
                </p>
              </div>
            </Card>
          ) : filteredFlights.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center">
                <Plane className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No flights found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or changing your search criteria.
                </p>
                <Button onClick={() => setFilterOptions({
                  airlines: [],
                  maxPrice: 2000,
                  maxStops: 2,
                })}>Reset Filters</Button>
              </div>
            </Card>
          ) : (
            <InfiniteScroll
              dataLength={filteredFlights.length}
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              loader={<LoadingSkeleton />}
              endMessage={
                <p className="text-center text-muted-foreground py-4">
                  No more flights to load.
                </p>
              }
            >
              <div className="space-y-4">
                {filteredFlights.map((flight: FlightResult) => (
                  isRoundTripFlight(flight) ? (
                    <div key={`${flight.outbound.id}-${flight.return.id}`} className="grid grid-cols-2 gap-4">
                      <FlightCard
                        key={flight.outbound.id}
                        flight={flight.outbound}
                        cabin={searchParams.cabin}
                      />
                      <FlightCard
                        isReturn={true}
                        key={flight.return.id}
                        flight={flight.return}
                        cabin={searchParams.cabin}
                      />
                    </div>
                  ) : (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      cabin={searchParams.cabin}
                    />
                  )
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
