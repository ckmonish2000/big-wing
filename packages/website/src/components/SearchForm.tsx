
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRight, CalendarIcon, Map, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { airports } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { FlightSearchParams, TripType } from "@/types/flight";

const cabinOptions = [
  { value: "economy", label: "Economy" },
  { value: "premium_economy", label: "Premium Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First Class" },
];

const PassengerSelector = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        type="button"
        variant="outline" 
        size="icon" 
        className="h-8 w-8 rounded-full"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
      >
        -
      </Button>
      <span className="w-6 text-center">{value}</span>
      <Button 
        type="button"
        variant="outline" 
        size="icon" 
        className="h-8 w-8 rounded-full"
        onClick={() => onChange(Math.min(9, value + 1))}
        disabled={value >= 9}
      >
        +
      </Button>
    </div>
  );
};

const SearchForm = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default to 1 week from now
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Default to 2 weeks from now
  );
  const [passengers, setPassengers] = useState(1);
  const [cabin, setCabin] = useState<"economy" | "premium_economy" | "business" | "first">("economy");
  const [tripType, setTripType] = useState<TripType>("round-trip");
  
  const [originOpen, setOriginOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination || !departureDate) {
      return; // Simple validation
    }
    
    const searchParams: FlightSearchParams = {
      origin,
      destination,
      departureDate: departureDate.toISOString(),
      returnDate: tripType === "round-trip" && returnDate ? returnDate.toISOString() : undefined,
      passengers,
      cabin,
      tripType,
    };
    
    // Navigate to search results with params
    navigate(`/flights/search?${new URLSearchParams({
      origin,
      destination,
      departureDate: departureDate.toISOString(),
      ...(tripType === "round-trip" && returnDate && { returnDate: returnDate.toISOString() }),
      passengers: passengers.toString(),
      cabin,
      tripType,
    })}`);
  };
  
  return (
    <Card className="frosted-glass w-full max-w-4xl mx-auto overflow-hidden animate-slide-up rounded-xl border border-white/20 shadow-lg">
      <form onSubmit={handleSearch} className="p-6">
        <div className="space-y-6">
          <RadioGroup
            defaultValue="round-trip"
            className="flex space-x-4"
            value={tripType}
            onValueChange={(value) => setTripType(value as TripType)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="round-trip" id="round-trip" />
              <Label htmlFor="round-trip" className="cursor-pointer">Round Trip</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one-way" id="one-way" />
              <Label htmlFor="one-way" className="cursor-pointer">One Way</Label>
            </div>
          </RadioGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">From</Label>
              <Popover open={originOpen} onOpenChange={setOriginOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between bg-white/50"
                  >
                    {origin
                      ? airports.find((airport) => airport.code === origin)?.city || "Select origin"
                      : "Select origin"}
                    <Map className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command className="pointer-events-auto">
                    <CommandInput placeholder="Search airports..." />
                    <CommandEmpty>No airports found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {airports.map((airport) => (
                          <CommandItem
                            key={airport.code}
                            value={airport.code}
                            onSelect={(value) => {
                              setOrigin(value);
                              setOriginOpen(false);
                            }}
                          >
                            <div className="flex flex-col">
                              <span>{airport.city}, {airport.country}</span>
                              <span className="text-xs text-muted-foreground">{airport.name} ({airport.code})</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">To</Label>
              <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between bg-white/50"
                  >
                    {destination
                      ? airports.find((airport) => airport.code === destination)?.city || "Select destination"
                      : "Select destination"}
                    <Map className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command className="pointer-events-auto">
                    <CommandInput placeholder="Search airports..." />
                    <CommandEmpty>No airports found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {airports.map((airport) => (
                          <CommandItem
                            key={airport.code}
                            value={airport.code}
                            onSelect={(value) => {
                              setDestination(value);
                              setDestinationOpen(false);
                            }}
                          >
                            <div className="flex flex-col">
                              <span>{airport.city}, {airport.country}</span>
                              <span className="text-xs text-muted-foreground">{airport.name} ({airport.code})</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departure">Departure</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white/50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {tripType === "round-trip" && (
              <div className="space-y-2">
                <Label htmlFor="return">Return</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-white/50"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      disabled={(date) => date < (departureDate || new Date())}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passengers">Passengers</Label>
              <div className="flex items-center space-x-4 h-10 p-2 border rounded-md bg-white/50">
                <Users className="h-4 w-4 text-muted-foreground" />
                <PassengerSelector value={passengers} onChange={setPassengers} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cabin">Cabin Class</Label>
              <Select value={cabin} onValueChange={(value) => setCabin(value as any)}>
                <SelectTrigger className="bg-white/50">
                  <SelectValue placeholder="Select cabin class" />
                </SelectTrigger>
                <SelectContent className="pointer-events-auto">
                  {cabinOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto px-8 rounded-full bg-primary hover:bg-primary/90">
            Search Flights
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SearchForm;
