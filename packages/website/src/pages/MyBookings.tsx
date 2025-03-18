import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ArrowLeft, ArrowRight, Filter, CalendarIcon, Clock, Plane, ArrowUpDown, Search } from "lucide-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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

import { Skeleton } from "@/components/atoms/skeleton";
import { airlines } from "@/lib/mockData";
import { Flight, FlightSearchParams, FlightFilterOptions, SortCriteria, SortOption, BookingResponse } from "@/types";
import { getOneWayFlights, getRoundTripFlights } from "@/services/flights.service";
import { FlightPage, RoundTripFlightPage } from "@/types/index"
import { PaginatedRoundTripFlightsResponse, RoundTripFlights, Booking } from "@big-wing/common";
import { OneWayFlightCard, RoundTripFlightCard } from "@/components/molecules/FlightCard";
import { getBookings } from "@/services/bookings.service";
import { Ticket } from "@/components/molecules/Booking";
import { User } from "@supabase/supabase-js";
import { bookingMaker, ticketMaker } from "@/lib/utils";
import { Input } from "@/components/atoms/input";

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

  const { data: bookings, isLoading, isError } = useQuery<BookingResponse[]>({
    queryKey: ['bookings'],
    queryFn: getBookings,
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
                  onChange={(e) => {
                    // Handle search input
                  }}
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
                  Please try again later.
                </p>
              </div>
            </Card>
          ) : !bookings || bookings.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center">
                <Plane className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't made any bookings yet.
                </p>
                <Button onClick={() => navigate('/')}>
                  Search for flights
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings?.map((booking) => {
                return <Link to={`/bookings/${booking.id}`}>
                  <Ticket
                    hidePassenger={true}
                    flight={ticketMaker(booking)}
                    booking={bookingMaker(booking)} />
                </Link>
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
