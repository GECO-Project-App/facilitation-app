import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://192.168.0.6:8000'; // Use your Supabase URL (local in this case)
// const supabaseUrl = 'http://supabase.projectgeco.com';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';
// const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyNjUwODM0MCwiZXhwIjo0ODgyMTgxOTQwLCJyb2xlIjoiYW5vbiJ9.DjDw6qvEtjihCqj6clJnftVBUCcsfXB1N0Hf4-00Q_s';
// const supabaseAnothertKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyNjUwODM0MCwiZXhwIjo0ODgyMTgxOTQwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.O1fiCNKkYDASiTt-lbE8CTlnp7NCZThr6kX5Y9PAVXI';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
