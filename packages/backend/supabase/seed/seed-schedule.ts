/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SupabaseClient } from '@supabase/supabase-js';

const schedules = [
  {
    flightNumber: 'AA100',
    departureTime: '08:00:00',
    arrivalTime: '16:00:00',
    frequency: 'Daily',
    price: 1200.0,
  },
  {
    flightNumber: 'UA201',
    departureTime: '10:30:00',
    arrivalTime: '14:45:00',
    frequency: 'Daily',
    price: 450.0,
  },
  {
    flightNumber: 'DL401',
    departureTime: '14:15:00',
    arrivalTime: '21:30:00',
    frequency: 'Weekly',
    price: 750.0,
  },
  {
    flightNumber: 'BA172',
    departureTime: '07:45:00',
    arrivalTime: '14:00:00',
    frequency: 'Daily',
    price: 3500.0,
  },
  {
    flightNumber: 'LH400',
    departureTime: '13:20:00',
    arrivalTime: '22:05:00',
    frequency: 'Bi-Weekly',
    price: 2200.0,
  },
  {
    flightNumber: 'AF337',
    departureTime: '09:30:00',
    arrivalTime: '20:45:00',
    frequency: 'Daily',
    price: 1800.0,
  },
  {
    flightNumber: 'EK203',
    departureTime: '23:30:00',
    arrivalTime: '12:15:00',
    frequency: 'Weekly',
    price: 4500.0,
  },
  {
    flightNumber: 'SQ321',
    departureTime: '19:10:00',
    arrivalTime: '08:20:00',
    frequency: 'Daily',
    price: 2800.0,
  },
  {
    flightNumber: 'QF1',
    departureTime: '17:00:00',
    arrivalTime: '15:50:00',
    frequency: 'Weekly',
    price: 5200.0,
  },
  {
    flightNumber: 'AC855',
    departureTime: '15:30:00',
    arrivalTime: '23:15:00',
    frequency: 'Daily',
    price: 1100.0,
  },
  {
    flightNumber: 'KL601',
    departureTime: '11:45:00',
    arrivalTime: '23:00:00',
    frequency: 'Bi-Weekly',
    price: 2400.0,
  },
  {
    flightNumber: 'NH106',
    departureTime: '21:50:00',
    arrivalTime: '07:35:00',
    frequency: 'Daily',
    price: 4800.0,
  },
  {
    flightNumber: 'KE90',
    departureTime: '12:15:00',
    arrivalTime: '03:45:00',
    frequency: 'Weekly',
    price: 2600.0,
  },
  {
    flightNumber: 'CA987',
    departureTime: '08:40:00',
    arrivalTime: '18:05:00',
    frequency: 'Daily',
    price: 900.0,
  },
  {
    flightNumber: 'TK77',
    departureTime: '22:10:00',
    arrivalTime: '11:50:00',
    frequency: 'Bi-Weekly',
    price: 1900.0,
  },
];

export default async function seedSchedules(supabase: SupabaseClient) {
  console.log('🚀 Seeding flight schedules...');

  // Fetch all routes to get the route IDs for each flight
  const { data: routeData, error: routeError } = await supabase
    .from('routes')
    .select('id, flightId, originId, destinationId');

  if (routeError) {
    console.error('❌ Error fetching routes:', routeError);
    return;
  }

  // Fetch all flights to map flight numbers to their IDs
  const { data: flightData, error: flightError } = await supabase
    .from('flights')
    .select('id, flightNumber');

  if (flightError) {
    console.error('❌ Error fetching flights:', flightError);
    return;
  }

  const flightMap = new Map(flightData.map((f) => [f.flightNumber, f.id]));
  const routeMap = new Map(routeData.map((r) => [r.flightId, r.id]));

  for (const schedule of schedules) {
    const flightId = flightMap.get(schedule.flightNumber);
    const routeId = routeMap.get(flightId);

    if (!flightId || !routeId) {
      console.error(`❌ Route not found for flight: ${schedule.flightNumber}`);
      continue;
    }

    // Insert schedule into schedules table
    const { error: scheduleError } = await supabase.from('schedules').upsert({
      routeId: routeId,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      frequency: schedule.frequency,
      price: schedule.price,
    });

    if (scheduleError) {
      console.error(
        `❌ Error inserting schedule for flight ${schedule.flightNumber}:`,
        scheduleError,
      );
    }
  }

  console.log('✅ Flight schedules seeding completed');
}
