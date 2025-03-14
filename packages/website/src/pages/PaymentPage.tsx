import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plane, Calendar, Users, CreditCard, Check } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import CardForm, { SavedCard } from "@/components/CardForm";
import { generateMockFlights } from "@/lib/mockData";
import { Flight, BookingPassenger } from "@/types/flight";

// Helper function to format minutes to hours and minutes
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Mock saved cards
const mockSavedCards: SavedCard[] = [
  {
    id: "card1",
    cardNumber: "4111111111111111",
    nameOnCard: "John Doe",
    expiryDate: "12/25",
    isDefault: true,
  },
  {
    id: "card2",
    cardNumber: "5555555555554444",
    nameOnCard: "John Doe",
    expiryDate: "10/24",
    isDefault: false,
  },
];

// Mock passenger data
const mockPassengers: BookingPassenger[] = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
  },
];

const PaymentPage = () => {
  const { flightId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Get flight details based on ID
  useEffect(() => {
    // Check if we have flight data in location state
    if (location.state?.flight) {
      setFlight(location.state.flight);
      setIsLoading(false);
      return;
    }

    // Otherwise generate some mock data
    setIsLoading(true);
    setTimeout(() => {
      // Generate a mock flight
      const mockFlights = generateMockFlights("JFK", "LAX", new Date().toISOString(), 1);
      setFlight(mockFlights.find(f => f.id === flightId) || mockFlights[0]);
      setIsLoading(false);
    }, 1000);
  }, [flightId, location.state]);

  const handlePaymentComplete = () => {
    setIsConfirmed(true);
    setActiveTab("confirmation");
  };

  if (isLoading || !flight) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-md"></div>
          <div className="h-64 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  const cabinPrice = flight.prices.find(p => p.cabin === "economy") || flight.prices[0];
  const departureTime = parseISO(flight.departure.time);
  const arrivalTime = parseISO(flight.arrival.time);
  const totalAmount = cabinPrice.amount * mockPassengers.length;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Complete Your Booking</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" disabled={isConfirmed}>
            Flight Details
          </TabsTrigger>
          <TabsTrigger value="payment" disabled={isConfirmed}>
            Payment
          </TabsTrigger>
          <TabsTrigger value="confirmation">
            Confirmation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Flight Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 mr-4 rounded-full overflow-hidden">
                    <img src={flight.airline.logo} alt={flight.airline.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold">{flight.airline.name}</p>
                    <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                  </div>
                </div>
                <Badge variant="outline">{cabinPrice.cabin.replace('_', ' ')}</Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Departure</p>
                  <p className="text-xl font-bold">{format(departureTime, "HH:mm")}</p>
                  <p className="text-sm">{format(departureTime, "EEE, MMM d, yyyy")}</p>
                  <p className="font-medium">{flight.departure.airport.name}</p>
                  <p className="text-sm text-muted-foreground">{flight.departure.airport.city}, {flight.departure.airport.country}</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground mb-2">{formatDuration(flight.duration)}</p>
                  <div className="relative w-full max-w-[240px] h-[2px] bg-gray-300 my-2">
                    <div className="absolute top-1/2 left-0 w-2 h-2 bg-primary rounded-full transform -translate-y-1/2"></div>
                    {flight.stops > 0 && flight.connection?.map((conn, idx) => (
                      <div 
                        key={idx}
                        className="absolute top-1/2 w-2 h-2 bg-gray-500 rounded-full transform -translate-y-1/2"
                        style={{ left: `${((idx + 1) / (flight.stops + 1)) * 100}%` }}
                      ></div>
                    ))}
                    <div className="absolute top-1/2 right-0 w-2 h-2 bg-primary rounded-full transform -translate-y-1/2"></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Arrival</p>
                  <p className="text-xl font-bold">{format(arrivalTime, "HH:mm")}</p>
                  <p className="text-sm">{format(arrivalTime, "EEE, MMM d, yyyy")}</p>
                  <p className="font-medium">{flight.arrival.airport.name}</p>
                  <p className="text-sm text-muted-foreground">{flight.arrival.airport.city}, {flight.arrival.airport.country}</p>
                </div>
              </div>

              {flight.stops > 0 && flight.connection && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Connection Details</p>
                  {flight.connection.map((conn, idx) => (
                    <div key={idx} className="ml-4 pl-4 border-l-2 border-gray-200 py-1">
                      <p className="text-sm">
                        {conn.airport?.city} ({conn.airport?.code})
                        {conn.duration && ` · ${formatDuration(conn.duration)} layover`}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Passenger Details</p>
                {mockPassengers.map((passenger, idx) => (
                  <div key={idx} className="flex items-center p-3 border rounded-md mb-2">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{passenger.firstName} {passenger.lastName}</p>
                      <p className="text-sm text-muted-foreground">{passenger.email}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{mockPassengers.length} passenger{mockPassengers.length > 1 ? 's' : ''}</p>
                </div>
                <Button onClick={() => setActiveTab("payment")}>
                  Proceed to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CardForm 
                savedCards={mockSavedCards} 
                onPaymentComplete={handlePaymentComplete} 
                totalAmount={totalAmount}
                currency="$"
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center mb-4">
                    <Plane className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="font-medium">{flight.departure.airport.code}</span>
                      {" → "}
                      <span className="font-medium">{flight.arrival.airport.code}</span>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div className="text-sm">
                      <span>{format(departureTime, "EEE, MMM d")}</span>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div className="text-sm">
                      <span>{mockPassengers.length} Passenger{mockPassengers.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Base fare</span>
                      <span className="text-sm">${cabinPrice.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Taxes & fees</span>
                      <span className="text-sm">$45.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="confirmation">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Your booking has been confirmed and your tickets have been sent to your email.
                </p>

                <div className="border rounded-lg p-4 w-full max-w-md mb-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Booking Reference</p>
                      <p className="font-bold">ABC123XYZ</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{format(new Date(), "MMM d, yyyy")}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Flight</p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                        <img src={flight.airline.logo} alt={flight.airline.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{flight.airline.name} {flight.flightNumber}</p>
                        <p className="text-sm">
                          {flight.departure.airport.code} → {flight.arrival.airport.code}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Departure</p>
                      <p className="font-medium">{format(departureTime, "HH:mm")}</p>
                      <p className="text-sm">{format(departureTime, "EEE, MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Arrival</p>
                      <p className="font-medium">{format(arrivalTime, "HH:mm")}</p>
                      <p className="text-sm">{format(arrivalTime, "EEE, MMM d, yyyy")}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Passenger(s)</p>
                    {mockPassengers.map((passenger, idx) => (
                      <p key={idx} className="font-medium">
                        {passenger.firstName} {passenger.lastName}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Return to Home
                  </Button>
                  <Button>
                    Download Ticket
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentPage;
