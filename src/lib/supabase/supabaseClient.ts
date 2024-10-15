import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const supabaseUrl = 'http://supabase.projectgeco.com';
// const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyNjUwODM0MCwiZXhwIjo0ODgyMTgxOTQwLCJyb2xlIjoiYW5vbiJ9.DjDw6qvEtjihCqj6clJnftVBUCcsfXB1N0Hf4-00Q_s';
// const supabaseAnothertKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyNjUwODM0MCwiZXhwIjo0ODgyMTgxOTQwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.O1fiCNKkYDASiTt-lbE8CTlnp7NCZThr6kX5Y9PAVXI';
export const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);
