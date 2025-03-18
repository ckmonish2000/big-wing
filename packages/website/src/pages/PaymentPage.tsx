import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Plane, Calendar, Users, CreditCard, Check } from "lucide-react";
import { differenceInMinutes, format, parseISO } from "date-fns";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Separator } from "@/components/atoms/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { Badge } from "@/components/atoms/badge";
import CardForm, { SavedCard } from "@/components/CardForm";
import { generateMockFlights } from "@/lib/mockData";
import { Flight, BookingPassenger } from "@/types";
import { getFlightById } from "@/services/flights.service";
import { useAuth } from "@/hooks/use-auth";
import { filghtDataMaker } from "@/lib/utils";

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


const FlightDetils = ({ flight, isReturn }: { flight: Flight, isReturn?: boolean }) => {
  return (<>
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
      {isReturn && (
        <div className="px-2 py-1 bg-muted rounded text-sm font-medium">
          Return Flight
        </div>
      )}
    </div>

    <Separator />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Departure</p>
        <p className="text-xl font-bold">{format(flight.departure.time, "HH:mm")}</p>
        <p className="text-sm">{format(flight.departure.time, "EEE, MMM d, yyyy")}</p>
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
        <p className="text-xl font-bold">{format(flight.arrival.time, "HH:mm")}</p>
        <p className="text-sm">{format(flight.arrival.time, "EEE, MMM d, yyyy")}</p>
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
  </>)
}

const PaymentPage = () => {
  const { flightId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const outboundScheduleId = searchParams.get('outboundScheduleId');
  const returnScheduleId = searchParams.get('returnScheduleId');
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [returnFlight, setReturnFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const { user } = useAuth();

  // Get flight details based on ID
  useEffect(() => {
    if (outboundScheduleId) {
      setIsLoading(true);
      getFlightById(outboundScheduleId)
        .then((flightData) => {
          setFlight(filghtDataMaker(flightData));
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching flight details:', error);
          setIsLoading(false);
        });
    }

    if (returnScheduleId) {
      setIsLoading(true);
      getFlightById(returnScheduleId)
        .then((flightData) => {
          setReturnFlight(filghtDataMaker(flightData));
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching flight details:', error);
          setIsLoading(false);
        });
    }
  }, [outboundScheduleId, returnScheduleId]);

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

  const cabinPrice = flight.prices[0];
  const departureTime = parseISO(flight.departure.time);
  const arrivalTime = parseISO(flight.arrival.time);
  const totalAmount = returnFlight ? flight.prices[0].amount + returnFlight.prices[0].amount : flight.prices[0].amount //* mockPassengers.length;

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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details" disabled={isConfirmed}>
            Flight Details
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
              <FlightDetils
                flight={flight}
              />

              {returnFlight && <FlightDetils
                isReturn={true}
                flight={returnFlight}
              />}

              <div>
                <p className="text-sm font-medium mb-2">Passenger Details</p>
                {/* {mockPassengers.map((passenger, idx) => ( */}
                <div className="flex items-center p-3 border rounded-md mb-2">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>

                    <p className="font-medium">{user?.user_metadata?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                {/* ))} */}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{mockPassengers.length} passenger{mockPassengers.length > 1 ? 's' : ''}</p>
                </div>
                <Button onClick={() => setActiveTab("confirmation")}>
                  Proceed to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
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
