
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addMinutes } from "date-fns";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/atoms/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { Checkbox } from "@/components/atoms/checkbox";
import { Separator } from "@/components/atoms/separator";
import { toast } from "@/components/atoms/sonner";
import { Flight, FlightPrice, BookingPassenger } from "@/types/flight";

interface BookingProcessProps {
  outboundFlight?: Flight;
  returnFlight?: Flight;
  selectedOutboundPrice?: FlightPrice;
  selectedReturnPrice?: FlightPrice;
  onComplete: (passengers: BookingPassenger[]) => void;
}

const bookingFormSchema = z.object({
  passengers: z.array(
    z.object({
      firstName: z.string().min(1, { message: "First name is required" }),
      lastName: z.string().min(1, { message: "Last name is required" }),
      email: z.string().email({ message: "Invalid email address" }),
      phone: z.string().optional(),
      dateOfBirth: z.string().optional(),
      specialAssistance: z.boolean().default(false),
    })
  ),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const formatTime = (timeString: string) => {
  const date = new Date(timeString);
  return format(date, "HH:mm");
};

const formatDate = (timeString: string) => {
  const date = new Date(timeString);
  return format(date, "MMM dd, yyyy");
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const BookingProcess = ({
  outboundFlight,
  returnFlight,
  selectedOutboundPrice,
  selectedReturnPrice,
  onComplete,
}: BookingProcessProps) => {
  const navigate = useNavigate();
  const [passengerCount, setPassengerCount] = useState(1);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      passengers: [
        {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          specialAssistance: false,
        },
      ],
      agreeToTerms: false,
    },
  });
  
  // Calculate total price
  const totalPrice = 
    (selectedOutboundPrice?.amount || 0) + 
    (selectedReturnPrice?.amount || 0);
  
  const onSubmit = (values: BookingFormValues) => {
    if (!outboundFlight || !selectedOutboundPrice) {
      toast.error("Please select at least an outbound flight before booking");
      return;
    }
    
    onComplete(values.passengers);
    
    toast.success("Booking completed successfully!");
    navigate("/booking/confirmation");
  };
  
  // Add a passenger form
  const addPassenger = () => {
    if (passengerCount >= 9) return;
    
    const currentPassengers = form.getValues().passengers;
    form.setValue("passengers", [
      ...currentPassengers,
      {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        specialAssistance: false,
      },
    ]);
    
    setPassengerCount(passengerCount + 1);
  };
  
  // Remove a passenger form
  const removePassenger = (index: number) => {
    if (passengerCount <= 1) return;
    
    const currentPassengers = form.getValues().passengers;
    currentPassengers.splice(index, 1);
    form.setValue("passengers", currentPassengers);
    
    setPassengerCount(passengerCount - 1);
  };
  
  if (!outboundFlight || !selectedOutboundPrice) {
    return (
      <Card className="my-8 animate-fade-in">
        <CardContent className="p-6">
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              Please select your flights to proceed with booking.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8 my-8 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle>Your Flight Selection</CardTitle>
          <CardDescription>
            Review your selected flights before proceeding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Outbound Flight</h3>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-accent/50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={outboundFlight.airline.logo}
                      alt={outboundFlight.airline.name}
                      className="object-contain p-1"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=150&h=150&q=80";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{outboundFlight.airline.name}</p>
                    <p className="text-xs text-muted-foreground">{outboundFlight.flightNumber}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
                  <div>
                    <p className="font-semibold">
                      {formatTime(outboundFlight.departure.time)} - {formatTime(outboundFlight.arrival.time)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(outboundFlight.departure.time)}
                    </p>
                  </div>
                  
                  <div className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground whitespace-nowrap">
                    {formatDuration(outboundFlight.duration)}
                  </div>
                  
                  <div>
                    <p className="font-semibold">
                      {outboundFlight.departure.airport.code} - {outboundFlight.arrival.airport.code}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {outboundFlight.stops === 0 ? "Direct" : `${outboundFlight.stops} Stop(s)`}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-lg font-bold text-primary">
                    ${selectedOutboundPrice.amount}
                  </p>
                </div>
              </div>
            </div>
            
            {returnFlight && selectedReturnPrice && (
              <div>
                <h3 className="text-lg font-medium mb-4">Return Flight</h3>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-accent/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img
                        src={returnFlight.airline.logo}
                        alt={returnFlight.airline.name}
                        className="object-contain p-1"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=150&h=150&q=80";
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{returnFlight.airline.name}</p>
                      <p className="text-xs text-muted-foreground">{returnFlight.flightNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
                    <div>
                      <p className="font-semibold">
                        {formatTime(returnFlight.departure.time)} - {formatTime(returnFlight.arrival.time)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(returnFlight.departure.time)}
                      </p>
                    </div>
                    
                    <div className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground whitespace-nowrap">
                      {formatDuration(returnFlight.duration)}
                    </div>
                    
                    <div>
                      <p className="font-semibold">
                        {returnFlight.departure.airport.code} - {returnFlight.arrival.airport.code}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {returnFlight.stops === 0 ? "Direct" : `${returnFlight.stops} Stop(s)`}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-lg font-bold text-primary">
                      ${selectedReturnPrice.amount}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between items-center py-4">
              <p className="font-medium">Total Price</p>
              <p className="text-2xl font-bold text-primary">${totalPrice}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Passenger Information</CardTitle>
          <CardDescription>
            Enter details for all passengers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {form.getValues().passengers.map((_, index) => (
                <div key={index} className="space-y-4">
                  {index > 0 && <Separator className="my-6" />}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Passenger {index + 1}</h3>
                    {passengerCount > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePassenger(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`passengers.${index}.firstName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`passengers.${index}.lastName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`passengers.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`passengers.${index}.phone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 123 456 7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`passengers.${index}.dateOfBirth`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth (Optional)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`passengers.${index}.specialAssistance`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Special Assistance Required</FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              
              {passengerCount < 9 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPassenger}
                  className="w-full"
                >
                  Add Another Passenger
                </Button>
              )}
              
              <Separator />
              
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the terms and conditions and understand the cancellation policy
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full sm:w-auto rounded-full">
                Complete Booking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingProcess;
