/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SupabaseClient } from '@supabase/supabase-js';

const flights = [
  { flightNumber: 'AA100', airlineCode: 'AA' },
  { flightNumber: 'UA201', airlineCode: 'UA' },
  { flightNumber: 'DL401', airlineCode: 'DL' },
  { flightNumber: 'BA172', airlineCode: 'BA' },
  { flightNumber: 'LH400', airlineCode: 'LH' },
  { flightNumber: 'AF337', airlineCode: 'AF' },
  { flightNumber: 'EK203', airlineCode: 'EK' },
  { flightNumber: 'SQ321', airlineCode: 'SQ' },
  { flightNumber: 'QF1', airlineCode: 'QF' },
  { flightNumber: 'AC855', airlineCode: 'AC' },
  { flightNumber: 'KL601', airlineCode: 'KL' },
  { flightNumber: 'NH106', airlineCode: 'NH' },
  { flightNumber: 'KE90', airlineCode: 'KE' },
  { flightNumber: 'CA987', airlineCode: 'CA' },
  { flightNumber: 'TK77', airlineCode: 'TK' },
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
  console.log('🚀 Seeding flights and routes...');

  // Fetch airline and location IDs
  const { data: airlineData, error: airlineError } = await supabase
    .from('airlines')
    .select('id, code');
  if (airlineError) {
    console.error('❌ Error fetching airlines:', airlineError);
    return;
  }

  const { data: locationData, error: locationError } = await supabase
    .from('locations')
    .select('id, code');
  if (locationError) {
    console.error('❌ Error fetching locations:', locationError);
    return;
  }

  const airlineMap = new Map(airlineData.map((a) => [a.code, a.id]));
  const locationMap = new Map(locationData.map((l) => [l.code, l.id]));

  for (const flight of flights) {
    const airlineId = airlineMap.get(flight.airlineCode);

    if (!airlineId) {
      console.error(`❌ Airline not found: ${flight.airlineCode}`);
      continue;
    }

    // Insert flight into flights table
    const { data: flightData, error: flightError } = await supabase
      .from('flights')
      .upsert(
        {
          flightNumber: flight.flightNumber,
          airlineId: airlineId,
          flightStatus: 'On_Time',
        },
        { onConflict: 'flightNumber' },
      )
      .select('id')
      .single();

    if (flightError) {
      console.error(
        `❌ Error inserting flight ${flight.flightNumber}:`,
        flightError,
      );
      continue;
    }

    const flightId = flightData.id;
    const route = flightRoutes[flight.flightNumber];
    const originId = locationMap.get(route.origin);
    const destinationId = locationMap.get(route.destination);

    if (!originId || !destinationId) {
      console.error(`❌ Location not found for flight: ${flight.flightNumber}`);
      continue;
    }

    // Insert route into routes table
    const { error: routeError } = await supabase.from('routes').upsert({
      flightId: flightId,
      originId: originId,
      destinationId: destinationId,
    });

    if (routeError) {
      console.error(
        `❌ Error inserting route for flight ${flight.flightNumber}:`,
        routeError,
      );
    }
  }

  console.log('✅ Flights and routes seeding completed');
}
