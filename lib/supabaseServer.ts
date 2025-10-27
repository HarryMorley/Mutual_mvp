import { createClient } from '@supabase/supabase-js';

export const supabaseServer = () =>
  createClient(
    process.env.SUPABASE_URL!,            // server-only
    process.env.SUPABASE_SERVICE_ROLE!,   // server-only
    { auth: { persistSession: false } }
  );