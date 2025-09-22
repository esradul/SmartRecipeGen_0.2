import { createClient } from '@supabase/supabase-js';

let dataSupabase: ReturnType<typeof createClient> | null = null;

export const createDataSupabaseClient = (url: string, key: string) => {
  dataSupabase = createClient(url, key);
  return dataSupabase;
};

export const getDataSupabase = () => {
  return dataSupabase;
};

export const clearDataSupabase = () => {
  dataSupabase = null;
};
