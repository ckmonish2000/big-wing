import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseSecret = import.meta.env.VITE_SUPABASE_KEY!;

export default createClient(supabaseUrl, supabaseSecret)