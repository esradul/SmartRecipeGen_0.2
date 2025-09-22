import { createContext, useContext, useState, useEffect } from 'react';
import { createDataSupabaseClient, getDataSupabase, clearDataSupabase } from '@/lib/supabase';
import type { SupabaseConfig } from '@/types/database';

interface SupabaseContextType {
  config: SupabaseConfig | null;
  isConfigured: boolean;
  saveConfig: (config: SupabaseConfig) => void;
  disconnect: () => void;
  supabaseClient: ReturnType<typeof createDataSupabaseClient> | null;
}

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SupabaseConfig | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<ReturnType<typeof createDataSupabaseClient> | null>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('supabase-config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig) as SupabaseConfig;
        setConfig(parsedConfig);
        const client = createDataSupabaseClient(parsedConfig.url, parsedConfig.key);
        setSupabaseClient(client);
      } catch (error) {
        console.error('Failed to parse saved Supabase config:', error);
        localStorage.removeItem('supabase-config');
      }
    }
  }, []);

  const saveConfig = (newConfig: SupabaseConfig) => {
    setConfig(newConfig);
    localStorage.setItem('supabase-config', JSON.stringify(newConfig));
    const client = createDataSupabaseClient(newConfig.url, newConfig.key);
    setSupabaseClient(client);
  };

  const disconnect = () => {
    setConfig(null);
    setSupabaseClient(null);
    localStorage.removeItem('supabase-config');
    clearDataSupabase();
  };

  return (
    <SupabaseContext.Provider value={{
      config,
      isConfigured: !!config,
      saveConfig,
      disconnect,
      supabaseClient
    }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return context;
}
