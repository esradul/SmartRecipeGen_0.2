import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL || 'https://cwbghsfluthuyuvjmqsn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3Ymdoc2ZsdXRodXl1dmptcXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MTYxNjUsImV4cCI6MjA3MzQ5MjE2NX0.TDMn5GPS6535ACyRPDvqDjS2rmElCOlEx2nzj-0evek';

export const authSupabase = createClient(supabaseUrl, supabaseAnonKey);
