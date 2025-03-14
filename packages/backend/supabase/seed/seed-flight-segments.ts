/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SupabaseClient } from '@supabase/supabase-js';

const flightSegments = [
  {
    flightNumber: 'AA100',
    segmentNumber: 1,
    originCode: 'LAX',
    destinationCode: 'JFK',
    departureTime: '2024-03-20T10:00:00Z',
    arrivalTime: '2024-03-20T18:00:00Z',
    price: 1200.0,
    economySeatsAvailable: 180,
    premiumEconomySeatsAvailable: 28,
    businessSeatsAvailable: 48,
    firstClassSeatsAvailable: 8,
  },
  {
    flightNumber: 'UA201',
    segmentNumber: 1,
    originCode: 'SFO',
    destinationCode: 'ORD',
    departureTime: '2024-03-20T11:30:00Z',
    arrivalTime: '2024-03-20T17:45:00Z',
    price: 450.0,
    economySeatsAvailable: 200,
    premiumEconomySeatsAvailable: 40,
    businessSeatsAvailable: 20,
    firstClassSeatsAvailable: 0,
  },
  {
    flightNumber: 'DL401',
    segmentNumber: 1,
    originCode: 'JFK',
    destinationCode: 'CDG',
    departureTime: '2024-03-20T21:15:00Z',
    arrivalTime: '2024-03-21T10:30:00Z',
    price: 750.0,
    economySeatsAvailable: 160,
    premiumEconomySeatsAvailable: 35,
    businessSeatsAvailable: 30,
    firstClassSeatsAvailable: 0,
  },
  {
    flightNumber: 'BA172',
    segmentNumber: 1,
    originCode: 'LHR',
    destinationCode: 'JFK',
    departureTime: '2024-03-20T09:15:00Z',
    arrivalTime: '2024-03-20T12:30:00Z',
    price: 3500.0,
    economySeatsAvailable: 150,
    premiumEconomySeatsAvailable: 24,
    businessSeatsAvailable: 48,
    firstClassSeatsAvailable: 14,
  },
  {
    flightNumber: 'LH400',
    segmentNumber: 1,
    originCode: 'FRA',
    destinationCode: 'JFK',
    departureTime: '2024-03-20T13:45:00Z',
    arrivalTime: '2024-03-20T16:30:00Z',
    price: 2200.0,
    economySeatsAvailable: 168,
    premiumEconomySeatsAvailable: 32,
    businessSeatsAvailable: 42,
    firstClassSeatsAvailable: 8,
  },
  {
    flightNumber: 'AF337',
    segmentNumber: 1,
    originCode: 'CDG',
    destinationCode: 'DXB',
    departureTime: '2024-03-20T19:30:00Z',
    arrivalTime: '2024-03-21T05:30:00Z',
    price: 900.0,
    economySeatsAvailable: 165,
    premiumEconomySeatsAvailable: 36,
    businessSeatsAvailable: 40,
    firstClassSeatsAvailable: 0,
  },
  {
    flightNumber: 'AF337',
    segmentNumber: 2,
    originCode: 'DXB',
    destinationCode: 'PEK',
    departureTime: '2024-03-21T06:30:00Z',
    arrivalTime: '2024-03-21T12:45:00Z',
    price: 900.0,
    economySeatsAvailable: 165,
    premiumEconomySeatsAvailable: 36,
    businessSeatsAvailable: 40,
    firstClassSeatsAvailable: 0,
  },
  {
    flightNumber: 'EK203',
    segmentNumber: 1,
    originCode: 'DXB',
    destinationCode: 'JFK',
    departureTime: '2024-03-20T08:30:00Z',
    arrivalTime: '2024-03-20T14:15:00Z',
    price: 4500.0,
    economySeatsAvailable: 280,
    premiumEconomySeatsAvailable: 56,
    businessSeatsAvailable: 76,
    firstClassSeatsAvailable: 14,
  },
  {
    flightNumber: 'SQ321',
    segmentNumber: 1,
    originCode: 'SIN',
    destinationCode: 'DXB',
    departureTime: '2024-03-20T23:45:00Z',
    arrivalTime: '2024-03-21T03:30:00Z',
    price: 1400.0,
    economySeatsAvailable: 220,
    premiumEconomySeatsAvailable: 44,
    businessSeatsAvailable: 60,
    firstClassSeatsAvailable: 12,
  },
  {
    flightNumber: 'SQ321',
    segmentNumber: 2,
    originCode: 'DXB',
    destinationCode: 'LHR',
    departureTime: '2024-03-21T04:15:00Z',
    arrivalTime: '2024-03-21T05:55:00Z',
    price: 1400.0,
    economySeatsAvailable: 220,
    premiumEconomySeatsAvailable: 44,
    businessSeatsAvailable: 60,
    firstClassSeatsAvailable: 12,
  },
  {
    flightNumber: 'QF1',
    segmentNumber: 1,
    originCode: 'SYD',
    destinationCode: 'SIN',
    departureTime: '2024-03-20T16:20:00Z',
    arrivalTime: '2024-03-20T21:45:00Z',
    price: 2600.0,
    economySeatsAvailable: 200,
    premiumEconomySeatsAvailable: 40,
    businessSeatsAvailable: 52,
    firstClassSeatsAvailable: 14,
  },
  {
    flightNumber: 'QF1',
    segmentNumber: 2,
    originCode: 'SIN',
    destinationCode: 'LHR',
    departureTime: '2024-03-20T22:30:00Z',
    arrivalTime: '2024-03-21T05:10:00Z',
    price: 2600.0,
    economySeatsAvailable: 200,
    premiumEconomySeatsAvailable: 40,
    businessSeatsAvailable: 52,
    firstClassSeatsAvailable: 14,
  },
  {
    flightNumber: 'NH106',
    segmentNumber: 1,
    originCode: 'HND',
    destinationCode: 'LAX',
    departureTime: '2024-03-20T17:00:00Z',
    arrivalTime: '2024-03-20T10:45:00Z',
    price: 4800.0,
    economySeatsAvailable: 192,
    premiumEconomySeatsAvailable: 40,
    businessSeatsAvailable: 52,
    firstClassSeatsAvailable: 8,
  },
  {
    flightNumber: 'KE90',
    segmentNumber: 1,
    originCode: 'ICN',
    destinationCode: 'JFK',
    departureTime: '2024-03-20T10:30:00Z',
    arrivalTime: '2024-03-20T11:00:00Z',
    price: 2600.0,
    economySeatsAvailable: 188,
    premiumEconomySeatsAvailable: 36,
    businessSeatsAvailable: 48,
    firstClassSeatsAvailable: 12,
  },
  {
    flightNumber: 'TK77',
    segmentNumber: 1,
    originCode: 'ICN',
    destinationCode: 'AMS',
    departureTime: '2024-03-20T09:15:00Z',
    arrivalTime: '2024-03-20T14:30:00Z',
    price: 1900.0,
    economySeatsAvailable: 210,
    premiumEconomySeatsAvailable: 40,
    businessSeatsAvailable: 45,
    firstClassSeatsAvailable: 0,
  },
];

export default async function seedFlightSegments(supabase: SupabaseClient) {
  console.log('Seeding flight segments...');

  // First get all flight and location IDs
  const { data: flightData } = await supabase
    .from('flights')
    .select('id, flightNumber');
  const { data: locationData } = await supabase
    .from('locations')
    .select('id, code');

  const flightMap = new Map(flightData?.map((f) => [f.flightNumber, f.id]));
  const locationMap = new Map(locationData?.map((l) => [l.code, l.id]));

  for (const segment of flightSegments) {
    const flightId = flightMap.get(segment.flightNumber);
    const originId = locationMap.get(segment.originCode);
    const destinationId = locationMap.get(segment.destinationCode);

    if (!flightId || !originId || !destinationId) {
      console.error(
        'Required reference not found for segment:',
        `${segment.flightNumber}-${segment.segmentNumber}`,
      );
      continue;
    }

    const { error } = await supabase.from('flightSegments').upsert({
      flightId,
      segmentNumber: segment.segmentNumber,
      originId,
      destinationId,
      departureTime: segment.departureTime,
      arrivalTime: segment.arrivalTime,
      price: segment.price,
      economySeatsAvailable: segment.economySeatsAvailable,
      premiumEconomySeatsAvailable: segment.premiumEconomySeatsAvailable,
      businessSeatsAvailable: segment.businessSeatsAvailable,
      firstClassSeatsAvailable: segment.firstClassSeatsAvailable,
    });

    if (error) {
      console.error(
        'Error seeding flight segment:',
        `${segment.flightNumber}-${segment.segmentNumber}`,
        error,
      );
    }
  }

  console.log('Flight segments seeding completed');
}
