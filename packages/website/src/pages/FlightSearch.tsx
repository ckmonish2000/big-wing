
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ArrowLeft, ArrowRight, Filter, CalendarIcon, Clock, Plane, ArrowUpDown } from "lucide-react";
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
import { generateMockFlights, airlines } from "@/lib/mockData";
import { Flight, FlightSearchParams, FlightFilterOptions, SortCriteria, SortOption, SortDirection } from "@/types/flight";

// Helper function to format minutes to hours and minutes
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const FlightCard = ({ flight, cabin }: { flight: Flight; cabin: string }) => {
  const navigate = useNavigate();
  const cabinPrice = flight.prices.find(p => p.cabin === cabin) || flight.prices[0];
  const departureTime = parseISO(flight.departure.time);
  const arrivalTime = parseISO(flight.arrival.time);

  const handleSelectFlight = () => {
    navigate(`/payment/${flight.id}`, { state: { flight } });
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 mr-4 rounded-full overflow-hidden">
              <img src={flight.airline.logo} alt={flight.airline.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold">{flight.airline.name}</p>
              <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="text-center">
              <p className="text-lg font-bold">{format(departureTime, "HH:mm")}</p>
              <p className="text-sm">{flight.departure.airport.code}</p>
            </div>
            
            <div className="hidden md:flex flex-col items-center mx-4">
              <p className="text-xs text-muted-foreground">{formatDuration(flight.duration)}</p>
              <div className="relative w-32 h-[2px] bg-gray-300 my-2">
                <div className="absolute top-1/2 left-0 w-2 h-2 bg-primary rounded-full transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-0 w-2 h-2 bg-primary rounded-full transform -translate-y-1/2"></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-bold">{format(arrivalTime, "HH:mm")}</p>
              <p className="text-sm">{flight.arrival.airport.code}</p>
            </div>
            
            <div className="block md:hidden w-full">
              <div className="flex justify-between items-center my-2">
                <p className="text-xs text-muted-foreground">{formatDuration(flight.duration)}</p>
                <p className="text-xs text-muted-foreground">
                  {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="relative w-full h-[2px] bg-gray-300">
                <div className="absolute top-1/2 left-0 w-2 h-2 bg-primary rounded-full transform -translate-y-1/2"></div>
                {flight.stops > 0 && (
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                )}
                <div className="absolute top-1/2 right-0 w-2 h-2 bg-primary rounded-full transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end mt-4 md:mt-0 w-full md:w-auto">
            <p className="text-2xl font-bold">${cabinPrice.amount}</p>
            <p className="text-sm text-muted-foreground capitalize">{cabinPrice.cabin.replace('_', ' ')}</p>
            <Button className="mt-2" onClick={handleSelectFlight}>Select</Button>
          </div>
        </div>
        
        {flight.stops > 0 && flight.connection && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Connecting in {flight.connection[0].airport?.city} ({flight.connection[0].airport?.code})
              {flight.connection[0].duration && ` · ${formatDuration(flight.connection[0].duration)} layover`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
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

const FlightSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(null);
  const [filterOptions, setFilterOptions] = useState<FlightFilterOptions>({
    airlines: [],
    maxPrice: 2000,
    maxStops: 2,
  });
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>({
    option: 'price',
    direction: 'asc',
  });
  
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
    
    // Generate mock flights
    if (searchParamsObj.origin && searchParamsObj.destination && searchParamsObj.departureDate) {
      setTimeout(() => {
        const mockFlights = generateMockFlights(
          searchParamsObj.origin,
          searchParamsObj.destination,
          searchParamsObj.departureDate,
          15
        );
        setFlights(mockFlights);
        setFilteredFlights(mockFlights);
        setLoading(false);
      }, 1500); // Simulate loading
    } else {
      navigate('/');
    }
  }, [location.search, navigate]);
  
  // Apply filters and sorting
  useEffect(() => {
    if (!flights.length) return;
    
    let filtered = [...flights];
    
    // Filter by airlines
    if (filterOptions.airlines && filterOptions.airlines.length > 0) {
      filtered = filtered.filter(flight => 
        filterOptions.airlines?.includes(flight.airline.code)
      );
    }
    
    // Filter by max price
    if (filterOptions.maxPrice) {
      filtered = filtered.filter(flight => {
        const cabinPrice = flight.prices.find(p => p.cabin === searchParams?.cabin) || flight.prices[0];
        return cabinPrice.amount <= filterOptions.maxPrice!;
      });
    }
    
    // Filter by number of stops
    if (filterOptions.maxStops !== undefined) {
      filtered = filtered.filter(flight => flight.stops <= filterOptions.maxStops!);
    }
    
    // Filter by max duration
    if (filterOptions.duration) {
      filtered = filtered.filter(flight => flight.duration <= filterOptions.duration!);
    }
    
    // Sort results
    filtered.sort((a, b) => {
      const { option, direction } = sortCriteria;
      const multiplier = direction === 'asc' ? 1 : -1;
      
      switch (option) {
        case 'price': {
          const priceA = a.prices.find(p => p.cabin === searchParams?.cabin)?.amount || 0;
          const priceB = b.prices.find(p => p.cabin === searchParams?.cabin)?.amount || 0;
          return (priceA - priceB) * multiplier;
        }
        case 'duration': {
          return (a.duration - b.duration) * multiplier;
        }
        case 'departure': {
          return (new Date(a.departure.time).getTime() - new Date(b.departure.time).getTime()) * multiplier;
        }
        case 'arrival': {
          return (new Date(a.arrival.time).getTime() - new Date(b.arrival.time).getTime()) * multiplier;
        }
        default:
          return 0;
      }
    });
    
    setFilteredFlights(filtered);
  }, [flights, filterOptions, sortCriteria, searchParams]);
  
  const handleSortChange = (option: SortOption) => {
    setSortCriteria(prev => ({
      option,
      direction: prev.option === option ? (prev.direction === 'asc' ? 'desc' : 'asc') : 'asc',
    }));
  };
  
  const handleAirlineFilter = (code: string, checked: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      airlines: checked 
        ? [...(prev.airlines || []), code]
        : (prev.airlines || []).filter(c => c !== code),
    }));
  };
  
  const handleMaxPriceChange = (value: number[]) => {
    setFilterOptions(prev => ({
      ...prev,
      maxPrice: value[0],
    }));
  };
  
  const handleStopsFilter = (value: string) => {
    const stops = parseInt(value);
    setFilterOptions(prev => ({
      ...prev,
      maxStops: stops,
    }));
  };
  
  const resetFilters = () => {
    setFilterOptions({
      airlines: [],
      maxPrice: 2000,
      maxStops: 2,
    });
    setSortCriteria({
      option: 'price',
      direction: 'asc',
    });
  };
  
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
                <Button variant="ghost" size="sm" onClick={resetFilters}>
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
                          onCheckedChange={(checked) => handleAirlineFilter(airline.code, checked === true)}
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
                        onValueChange={handleMaxPriceChange}
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
                    onValueChange={handleStopsFilter}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="r1" />
                      <Label htmlFor="r1">Non-stop only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="r2" />
                      <Label htmlFor="r2">Up to 1 stop</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="r3" />
                      <Label htmlFor="r3">Up to 2 stops</Label>
                    </div>
                  </RadioGroup>
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
                onValueChange={(value) => handleSortChange(value as SortOption)}
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
                              onCheckedChange={(checked) => handleAirlineFilter(airline.code, checked === true)}
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
                            onValueChange={handleMaxPriceChange}
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
                        onValueChange={handleStopsFilter}
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
                      <Button onClick={resetFilters}>Reset Filters</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {loading ? (
            <LoadingSkeleton />
          ) : filteredFlights.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center">
                <Plane className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No flights found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or changing your search criteria.
                </p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <FlightCard 
                  key={flight.id} 
                  flight={flight} 
                  cabin={searchParams.cabin} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
