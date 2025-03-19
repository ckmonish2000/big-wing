import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRight, CalendarIcon, Map, Users } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Calendar } from "@/components/atoms/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { airports } from "@/lib/mockData";
import { Card } from "@/components/atoms/card";
import { FlightSearchParams, TripType } from "@/types";
import SearchDropdown from "./molecules/SearchDropDown";
import { getLocations } from "@/services/locations.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/form";

const cabinOptions = [
  { value: "economy", label: "Economy" },
  { value: "premium_economy", label: "Premium Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First Class" },
] as const;

const searchFormSchema = z.object({
  tripType: z.enum(["round-trip", "one-way"] as const),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  departureDate: z.date({
    required_error: "Departure date is required",
  }),
  returnDate: z.date().optional(),
  passengers: z.number().min(1).max(9),
  cabin: z.enum(["economy", "premium_economy", "business", "first"] as const),
}).refine(
  (data) => data.origin !== data.destination,
  {
    message: "Origin and destination cannot be the same",
    path: ["destination"], // Show error on destination field
  }
);

type SearchFormValues = z.infer<typeof searchFormSchema>;

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
  const [originOpen, setOriginOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      tripType: "round-trip",
      origin: "",
      destination: "",
      departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      passengers: 1,
      cabin: "economy",
    },
  });

  const fetchLocations = useCallback(async ({ pageParam = 1, search }: { pageParam: number, search: string }) => {
    const response = await getLocations({ page: pageParam, search })
    return {
      items: response.entity.data.map((item) => ({
        id: item.id,
        label: `${item.city} (${item.code})`,
        sublabel: item.name,
        value: item.code
      })),
      hasMore: response.entity.pagination.totalPages > pageParam
    }
  }, []);

  const onSubmit = (values: SearchFormValues) => {
    // console.log(, 'values');
    // Navigate to search results with params
    navigate(`/flights/search?${new URLSearchParams({
      origin: values.origin,
      destination: values.destination,
      departureDate: values.departureDate.toISOString(),
      ...(values.tripType === "round-trip" && values.returnDate && { returnDate: values.returnDate.toISOString() }),
      passengers: values.passengers.toString(),
      cabin: values.cabin,
      tripType: values.tripType,
    })}`);
  };

  return (
    <Card className="frosted-glass w-full max-w-4xl mx-auto overflow-hidden animate-slide-up rounded-xl border border-white/20 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="tripType"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <SearchDropdown
                        id="origin"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select origin"
                        open={originOpen}
                        onOpenChange={setOriginOpen}
                        fetchItems={fetchLocations}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <SearchDropdown
                        id="destination"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select destination"
                        open={destinationOpen}
                        onOpenChange={setDestinationOpen}
                        fetchItems={fetchLocations}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Departure</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-white/50"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("tripType") === "round-trip" && (
                <FormField
                  control={form.control}
                  name="returnDate"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Return</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-white/50"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < (form.watch("departureDate") || new Date())}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button type="submit" className="w-full md:w-auto px-8 rounded-full bg-primary hover:bg-primary/90">
              Search Flights
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default SearchForm;
