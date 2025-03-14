/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SupabaseClient } from '@supabase/supabase-js';

const flights = [
  {
    flightNumber: 'AA100',
    airlineId: null, // Will be populated from AA airline
    originId: null, // Will be populated from LAX location
    destinationId: null, // Will be populated from JFK location
    totalDuration: '8:00:00', // 8 hours as interval
    price: 1200.0,
    cabinClass: 'Business',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'UA201',
    airlineId: null, // Will be populated from UA airline
    originId: null, // Will be populated from SFO location
    destinationId: null, // Will be populated from ORD location
    totalDuration: '4:15:00',
    price: 450.0,
    cabinClass: 'Economy',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'DL401',
    airlineId: null, // Will be populated from DL airline
    originId: null, // Will be populated from JFK location
    destinationId: null, // Will be populated from CDG location
    totalDuration: '7:15:00',
    price: 750.0,
    cabinClass: 'Premium_Economy',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'BA172',
    airlineId: null, // Will be populated from BA airline
    originId: null, // Will be populated from LHR location
    destinationId: null, // Will be populated from JFK location
    totalDuration: '7:15:00',
    price: 3500.0,
    cabinClass: 'First',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'LH400',
    airlineId: null, // Will be populated from LH airline
    originId: null, // Will be populated from FRA location
    destinationId: null, // Will be populated from JFK location
    totalDuration: '8:45:00',
    price: 2200.0,
    cabinClass: 'Business',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'AF337',
    airlineId: null, // Will be populated from AF airline
    originId: null, // Will be populated from CDG location
    destinationId: null, // Will be populated from PEK location
    totalDuration: '11:15:00',
    price: 1800.0,
    cabinClass: 'Business',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'EK203',
    airlineId: null, // Will be populated from EK airline
    originId: null, // Will be populated from DXB location
    destinationId: null, // Will be populated from JFK location
    totalDuration: '13:45:00',
    price: 4500.0,
    cabinClass: 'First',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'SQ321',
    airlineId: null, // Will be populated from SQ airline
    originId: null, // Will be populated from SIN location
    destinationId: null, // Will be populated from LHR location
    totalDuration: '13:10:00',
    price: 2800.0,
    cabinClass: 'Business',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'QF1',
    airlineId: null, // Will be populated from QF airline
    originId: null, // Will be populated from SYD location
    destinationId: null, // Will be populated from LHR location
    totalDuration: '22:50:00',
    price: 5200.0,
    cabinClass: 'First',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'AC855',
    airlineId: null, // Will be populated from AC airline
    originId: null, // Will be populated from YYZ location
    destinationId: null, // Will be populated from LHR location
    totalDuration: '7:45:00',
    price: 1100.0,
    cabinClass: 'Premium_Economy',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'KL601',
    airlineId: null, // Will be populated from KL airline
    originId: null, // Will be populated from AMS location
    destinationId: null, // Will be populated from SIN location
    totalDuration: '12:45:00',
    price: 2400.0,
    cabinClass: 'Business',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'NH106',
    airlineId: null, // Will be populated from NH airline
    originId: null, // Will be populated from HND location
    destinationId: null, // Will be populated from LAX location
    totalDuration: '9:45:00',
    price: 4800.0,
    cabinClass: 'First',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'KE90',
    airlineId: null, // Will be populated from KE airline
    originId: null, // Will be populated from ICN location
    destinationId: null, // Will be populated from JFK location
    totalDuration: '14:30:00',
    price: 2600.0,
    cabinClass: 'Business',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'CA987',
    airlineId: null, // Will be populated from CA airline
    originId: null, // Will be populated from PEK location
    destinationId: null, // Will be populated from LHR location
    totalDuration: '11:25:00',
    price: 900.0,
    cabinClass: 'Premium_Economy',
    flightStatus: 'On_Time',
  },
  {
    flightNumber: 'TK77',
    airlineId: null, // Will be populated from TK airline
    originId: null, // Will be populated from ICN location
    destinationId: null, // Will be populated from AMS location
    totalDuration: '12:15:00',
    price: 1900.0,
    cabinClass: 'Business',
    flightStatus: 'On_Time',
  },
];

const flightRoutes: any = {
  AA100: { origin: 'LAX', destination: 'JFK' },
  UA201: { origin: 'SFO', destination: 'ORD' },
  DL401: { origin: 'JFK', destination: 'CDG' },
  BA172: { origin: 'LHR', destination: 'JFK' },
  LH400: { origin: 'FRA', destination: 'JFK' },
  AF337: { origin: 'CDG', destination: 'PEK' },
  EK203: { origin: 'DXB', destination: 'JFK' },
  SQ321: { origin: 'SIN', destination: 'LHR' },
  QF1: { origin: 'SYD', destination: 'LHR' },
  AC855: { origin: 'YYZ', destination: 'LHR' },
  KL601: { origin: 'AMS', destination: 'SIN' },
  NH106: { origin: 'HND', destination: 'LAX' },
  KE90: { origin: 'ICN', destination: 'JFK' },
  CA987: { origin: 'PEK', destination: 'LHR' },
  TK77: { origin: 'ICN', destination: 'AMS' },
};

export default async function seedFlights(supabase: SupabaseClient) {
  console.log('Seeding flights...');

  // First get all airline and location IDs
  const { data: airlineData } = await supabase
    .from('airlines')
    .select('id, code');
  const { data: locationData } = await supabase
    .from('locations')
    .select('id, code');

  const airlineMap = new Map(airlineData?.map((a) => [a.code, a.id]));
  const locationMap = new Map(locationData?.map((l) => [l.code, l.id]));
  for (const flight of flights) {
    const airlineCode = flight.flightNumber.substring(0, 2);
    const route = flightRoutes[flight.flightNumber];

    const airlineId = airlineMap.get(airlineCode);
    const originId = locationMap.get(route.origin);
    const destinationId = locationMap.get(route.destination);

    if (!airlineId || !originId || !destinationId) {
      console.error(
        'Required reference not found for flight:',
        flight.flightNumber,
      );
      continue;
    }

    const { error } = await supabase.from('flights').upsert(
      {
        ...flight,
        airlineId,
        originId,
        destinationId,
      },
      { onConflict: 'flightNumber' },
    );

    if (error) {
      console.error(
        'Error seeding flight:',
        {
          ...flight,
          airlineId,
          originId,
          destinationId,
        },
        error,
      );
    }
  }

  console.log('Flights seeding completed');
}
