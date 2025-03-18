/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/atoms/dialog";
import { Flight } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { RoundTripFlights } from "@big-wing/common";

// Helper function to format minutes to hours and minutes
const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};


export const OneWayFlightCard = ({ flight, isReturn, roundTripFlight }: { flight: Flight; isReturn?: boolean, roundTripFlight?: any }) => {
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
        if (roundTripFlight) {
            navigate(`/payment?outboundScheduleId=${roundTripFlight.outbound.scheduleId}&returnScheduleId=${roundTripFlight.return.scheduleId}`, { state: { roundTripFlight } });
        } else {
            navigate(`/payment?outboundScheduleId=${flight.scheduleId}`, { state: { flight } });
        }
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

export const RoundTripFlightCard = ({ flight }: any) => {
    return (
        <div key={`${flight.outbound.id}-${flight.return.id}`} className="grid grid-cols-2 gap-4">
            <OneWayFlightCard
                key={flight.outbound.id}
                flight={flight.outbound}
                roundTripFlight={flight}
            />
            <OneWayFlightCard
                isReturn={true}
                key={flight.return.id}
                flight={flight.return}
                roundTripFlight={flight}
            />
        </div>
    );
};