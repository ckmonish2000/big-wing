import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Plane, ArrowUpDown, Search, WifiOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";

import { Skeleton } from "@/components/atoms/skeleton";
import { Flight, FlightSearchParams, FlightFilterOptions, SortCriteria, SortOption, BookingResponse } from "@/types";
import { FlightPage, RoundTripFlightPage } from "@/types/index"
import {  RoundTripFlights } from "@big-wing/common";
import { getBookings } from "@/services/bookings.service";
import { Ticket } from "@/components/molecules/Booking";
import { bookingMaker, ticketMaker } from "@/lib/utils";
import { Input } from "@/components/atoms/input";
import worker_script from "@/workers";

export type QueryResult = FlightPage | RoundTripFlightPage;
export type FlightResult = Flight | RoundTripFlights;

// Helper function to format minutes to hours and minutes
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
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

function isRoundTripFlight(flight: FlightResult): flight is RoundTripFlights {
  return 'outbound' in flight && 'return' in flight;
}

function isRoundTripFlightPage(page: QueryResult): page is RoundTripFlightPage {
  return 'flights' in page && page.flights.length > 0 && 'outbound' in page.flights[0];
}

const FlightSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookings, setFilteredBookings] = useState<BookingResponse[]>([]);
  const workerRef = useRef<Worker | null>(null);

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(worker_script);
    workerRef.current.onmessage = (event) => {
      const { type, data } = event.data;
      if (type === 'SEARCH_RESULTS') {
        setFilteredBookings(data);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { data: bookings, isLoading, isError } = useQuery<BookingResponse[]>({
    queryKey: ['bookings'],
    queryFn: getBookings,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Update filtered bookings when bookings or search term changes
  useEffect(() => {
    if (bookings) {
      if (!searchTerm) {
        setFilteredBookings(bookings);
      } else {
        workerRef.current?.postMessage({
          type: 'SEARCH_BOOKINGS',
          data: { bookings, searchTerm }
        });
      }
    }
  }, [bookings, searchTerm]);

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

  if (!searchParams) return null;

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">My Bookings</h1>
      </div>

      {isOffline && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
          <WifiOff className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="text-yellow-800">You're offline. Showing cached data.</span>
        </div>
      )}

      <div className="">
        <div className="lg:col-span-3">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full">

              <div className="relative w-full mb-4 sm:mb-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search bookings..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={sortCriteria.option}
                onValueChange={(value) => setSortCriteria(prev => ({
                  ...prev,
                  option: value as SortOption,
                }))}
              >
                <SelectTrigger className="sm:w-[180px] w-full">
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

            </div>
          </div>

          {isLoading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center">
                <Plane className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Error loading bookings</h3>
                <p className="text-muted-foreground mb-4">
                  {isOffline 
                    ? "You're offline and no cached data is available."
                    : "Please try again later."}
                </p>
                {!isOffline && (
                  <Button onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                )}
              </div>
            </Card>
          ) : !filteredBookings || filteredBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center">
                <Plane className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? "No bookings match your search criteria."
                    : isOffline 
                      ? "You're offline and no cached bookings are available."
                      : "You haven't made any bookings yet."}
                </p>
                {!isOffline && !searchTerm && (
                  <Button onClick={() => navigate('/')}>
                    Search for flights
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Link key={booking.id} to={`/bookings/${booking.id}`}>
                  <Ticket
                    hidePassenger={true}
                    flight={ticketMaker(booking)}
                    booking={bookingMaker(booking)}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
