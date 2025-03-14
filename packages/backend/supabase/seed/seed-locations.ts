import { SupabaseClient } from '@supabase/supabase-js';

const locations = [
  {
    name: 'Los Angeles International Airport',
    code: 'LAX',
    city: 'Los Angeles',
    country: 'United States',
  },
  {
    name: 'John F. Kennedy International Airport',
    code: 'JFK',
    city: 'New York',
    country: 'United States',
  },
  {
    name: 'San Francisco International Airport',
    code: 'SFO',
    city: 'San Francisco',
    country: 'United States',
  },
  {
    name: "O'Hare International Airport",
    code: 'ORD',
    city: 'Chicago',
    country: 'United States',
  },
  {
    name: 'London Heathrow Airport',
    code: 'LHR',
    city: 'London',
    country: 'United Kingdom',
  },
  {
    name: 'Charles de Gaulle Airport',
    code: 'CDG',
    city: 'Paris',
    country: 'France',
  },
  {
    name: 'Dubai International Airport',
    code: 'DXB',
    city: 'Dubai',
    country: 'United Arab Emirates',
  },
  {
    name: 'Tokyo Haneda Airport',
    code: 'HND',
    city: 'Tokyo',
    country: 'Japan',
  },
  {
    name: 'Singapore Changi Airport',
    code: 'SIN',
    city: 'Singapore',
    country: 'Singapore',
  },
  {
    name: 'Sydney Airport',
    code: 'SYD',
    city: 'Sydney',
    country: 'Australia',
  },
  {
    name: 'Toronto Pearson International Airport',
    code: 'YYZ',
    city: 'Toronto',
    country: 'Canada',
  },
  {
    name: 'Frankfurt Airport',
    code: 'FRA',
    city: 'Frankfurt',
    country: 'Germany',
  },
  {
    name: 'Amsterdam Airport Schiphol',
    code: 'AMS',
    city: 'Amsterdam',
    country: 'Netherlands',
  },
  {
    name: 'Incheon International Airport',
    code: 'ICN',
    city: 'Seoul',
    country: 'South Korea',
  },
  {
    name: 'Beijing Capital International Airport',
    code: 'PEK',
    city: 'Beijing',
    country: 'China',
  },
];

export default async function seedLocations(supabase: SupabaseClient) {
  console.log('Seeding locations...');

  for (const location of locations) {
    const { error } = await supabase
      .from('locations')
      .upsert(location, { onConflict: 'code' });

    if (error) {
      console.error('Error seeding location:', location.code, error);
    }
  }

  console.log('Locations seeding completed');
}
