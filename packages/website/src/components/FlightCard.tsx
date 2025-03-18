
import { format, addMinutes } from "date-fns";
import { ArrowRight, Clock, Plane } from "lucide-react";
import { Card, CardContent } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Flight, FlightPrice } from "@/types";

// Helper function to format duration in hours and minutes
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

interface FlightCardProps {
  flight: Flight;
  selectedCabin: 'economy' | 'premium_economy' | 'business' | 'first';
  onSelect: (flight: Flight, price: FlightPrice) => void;
  isSelected?: boolean;
}

const FlightCard = ({ flight, selectedCabin, onSelect, isSelected = false }: FlightCardProps) => {
  const departureDate = new Date(flight.departure.time);
  const arrivalDate = new Date(flight.arrival.time);
  
  const selectedPrice = flight.prices.find(p => p.cabin === selectedCabin) || flight.prices[0];
  
  // Format time as HH:MM
  const departureTime = format(departureDate, "HH:mm");
  const arrivalTime = format(arrivalDate, "HH:mm");
  
  // Format date as MMM dd, yyyy (e.g. Jan 01, 2023)
  const departureDateStr = format(departureDate, "MMM dd, yyyy");
  const arrivalDateStr = format(arrivalDate, "MMM dd, yyyy");
  
  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : 'ring-0'}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <img 
                src={flight.airline.logo} 
                alt={flight.airline.name} 
                className="object-contain p-1"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=150&h=150&q=80";
                }}
              />
            </div>
            <div>
              <p className="font-medium">{flight.airline.name}</p>
              <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0 flex-1">
            <div className="text-center md:text-left">
              <p className="text-2xl font-semibold">{departureTime}</p>
              <p className="text-sm font-medium">{flight.departure.airport.code}</p>
              <p className="text-xs text-muted-foreground">{departureDateStr}</p>
            </div>
            
            <div className="flex flex-col items-center flex-1">
              <div className="text-xs text-muted-foreground mb-2 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(flight.duration)}
              </div>
              <div className="relative w-full flex items-center">
                <div className="border-t border-dashed border-gray-300 flex-1"></div>
                <Plane className="text-primary mx-2 rotate-90" size={16} />
                <div className="border-t border-dashed border-gray-300 flex-1"></div>
              </div>
              <div className="mt-2 text-xs">
                {flight.stops === 0 ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Direct
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                    {flight.stops} {flight.stops === 1 ? 'Stop' : 'Stops'}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-2xl font-semibold">{arrivalTime}</p>
              <p className="text-sm font-medium">{flight.arrival.airport.code}</p>
              <p className="text-xs text-muted-foreground">{arrivalDateStr}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end justify-center space-y-2">
            <p className="text-xl font-bold text-primary">
              ${selectedPrice.amount}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedPrice.cabin.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </p>
            <Button 
              onClick={() => onSelect(flight, selectedPrice)} 
              variant={isSelected ? "default" : "outline"}
              className="mt-2 rounded-full"
              size="sm"
            >
              {isSelected ? "Selected" : "Select"} 
              {!isSelected && <ArrowRight className="ml-1 h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {flight.stops > 0 && flight.connection && flight.connection.length > 0 && (
          <div className="mt-4 pt-4 border-t border-dashed">
            <p className="text-sm font-medium mb-2">Connection Details</p>
            {flight.connection.map((connection, index) => (
              <div key={index} className="text-xs text-muted-foreground flex items-center">
                <Badge variant="outline" className="mr-2 bg-gray-50">
                  {connection.duration && formatDuration(connection.duration)} at {connection.airport?.code}
                </Badge>
                <span>{connection.airport?.name}, {connection.airport?.city}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlightCard;
