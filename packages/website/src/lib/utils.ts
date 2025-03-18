import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const filghtDataMaker = (flightData) => {
  const routes = flightData.routes;
  const flight = routes.flights
  const airlines = flight.airlines
  const destination = routes.destination
  const origin = routes.origin
  return {
    "id": flight.id,
    "flightNumber": flight.flightNumber,
    "scheduleId": flightData.id,
    "airline": {
      "name": airlines.name,
      "code": airlines.code,
      "logo": airlines.logoUrl
    },
    "departure": {
      "time": flightData.departureTime,
      "airport": {
        "name": origin.name,
        "code": origin.code,
        "city": origin.city,
        "country": origin.country
      }
    },
    "arrival": {
      "time": flightData.arrivalTime,
      "airport": {
        "name": destination.name,
        "code": destination.code,
        "city": destination.city,
        "country": destination.country
      }
    },
    "duration": differenceInMinutes(parseISO(flightData.arrivalTime), parseISO(flightData.departureTime)),
    "stops": 0,
    "prices": [
      {
        "amount": flight.price,
        "currency": "USD",
        "cabin": "economy"
      }
    ]
  }
}