import { SupabaseClient } from '@supabase/supabase-js';

const airlines = [
  {
    name: 'American Airlines',
    code: 'AA',
    logoUrl: 'https://example.com/aa-logo.png',
    country: 'United States',
  },
  {
    name: 'United Airlines',
    code: 'UA',
    logoUrl: 'https://example.com/ua-logo.png',
    country: 'United States',
  },
  {
    name: 'Delta Air Lines',
    code: 'DL',
    logoUrl: 'https://example.com/dl-logo.png',
    country: 'United States',
  },
  {
    name: 'British Airways',
    code: 'BA',
    logoUrl: 'https://example.com/ba-logo.png',
    country: 'United Kingdom',
  },
  {
    name: 'Lufthansa',
    code: 'LH',
    logoUrl: 'https://example.com/lh-logo.png',
    country: 'Germany',
  },
  {
    name: 'Air France',
    code: 'AF',
    logoUrl: 'https://example.com/af-logo.png',
    country: 'France',
  },
  {
    name: 'Emirates',
    code: 'EK',
    logoUrl: 'https://example.com/ek-logo.png',
    country: 'United Arab Emirates',
  },
  {
    name: 'Singapore Airlines',
    code: 'SQ',
    logoUrl: 'https://example.com/sq-logo.png',
    country: 'Singapore',
  },
  {
    name: 'Qantas',
    code: 'QF',
    logoUrl: 'https://example.com/qf-logo.png',
    country: 'Australia',
  },
  {
    name: 'Air Canada',
    code: 'AC',
    logoUrl: 'https://example.com/ac-logo.png',
    country: 'Canada',
  },
  {
    name: 'KLM Royal Dutch Airlines',
    code: 'KL',
    logoUrl: 'https://example.com/kl-logo.png',
    country: 'Netherlands',
  },
  {
    name: 'All Nippon Airways',
    code: 'NH',
    logoUrl: 'https://example.com/nh-logo.png',
    country: 'Japan',
  },
  {
    name: 'Korean Air',
    code: 'KE',
    logoUrl: 'https://example.com/ke-logo.png',
    country: 'South Korea',
  },
  {
    name: 'Air China',
    code: 'CA',
    logoUrl: 'https://example.com/ca-logo.png',
    country: 'China',
  },
  {
    name: 'Turkish Airlines',
    code: 'TK',
    logoUrl: 'https://example.com/tk-logo.png',
    country: 'Turkey',
  },
];

export default async function seedAirlines(supabase: SupabaseClient) {
  console.log('Seeding airlines...');

  for (const airline of airlines) {
    const { error } = await supabase
      .from('airlines')
      .upsert(airline, { onConflict: 'code' });

    if (error) {
      console.error('Error seeding airline:', airline.code, error);
    }
  }

  console.log('Airlines seeding completed');
}
