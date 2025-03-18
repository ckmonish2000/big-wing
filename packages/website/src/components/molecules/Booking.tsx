import React from 'react'
import { Check } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/atoms/button";

import { Separator } from "@/components/atoms/separator";
import { useNavigate } from 'react-router-dom';
import { BookingPassenger, Flight } from '@/types';
import { Booking } from '@big-wing/common';
import { User } from '@supabase/supabase-js';


export const Ticket = ({ flight, booking, hidePassenger = false, }: { flight: Flight, booking?: Booking & { user?: User }, returnFlight?: Flight, hidePassenger?: boolean }) => {
    const departureTime = parseISO(flight.departure.time);
    const arrivalTime = parseISO(flight.arrival.time);
    return (
        // ${hidePassenger ? 'max-w-full' : 'max-w-md'}
        <div className={`border rounded-lg p-4 w-full  mb-6`}>
            <div className="flex justify-between mb-4">
                <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking?.bookingStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking?.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {booking?.bookingStatus}
                    </div>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Booking Reference</p>
                    <p className="font-bold">{booking?.id?.substring(0, 8)}</p>
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



            {!hidePassenger && <>

                <div>
                    <Separator className="my-4" />
                    <p className="text-sm text-muted-foreground mb-1">Passenger(s)</p>
                    {booking?.user?.email}
                </div>
            </>
            }
        </div>
    )
}

export default function BookingScreen({ flight, passengers, booking, returnBooking, returnFlight }: { flight: Flight, passengers: BookingPassenger[], booking: Booking, returnBooking?: Booking, returnFlight?: Flight }) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center text-center p-6">
            <Ticket flight={flight} booking={booking} />
            {returnFlight && <Ticket flight={returnFlight} booking={returnBooking} />}


            <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate("/")}>
                    Return to Home
                </Button>
            </div>
        </div>
    )
}