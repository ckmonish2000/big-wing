import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

import seedAirlines from './seed-airlines';
import seedLocation from './seed-locations';
import seedFlight from './seed-flights';
import seedSchedules from './seed-schedule';

console.log(path.join(__dirname, '../../.env'));
dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_KEY!,
);

const seed = async () => {
  try {
    console.log('Starting seeding');
    await seedLocation(supabase);
    await seedAirlines(supabase);
    await seedFlight(supabase);
    await seedSchedules(supabase);
    // await seedFlightSegments(supabase);
    console.log('Starting completed');
  } catch (e) {
    console.log('Failed to seed data', e);
  }
};

seed();
