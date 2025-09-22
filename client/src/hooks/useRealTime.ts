import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/contexts/SupabaseProvider';

export function useRealTime(enabled: boolean = true) {
  const { supabaseClient, config } = useSupabase();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !supabaseClient || !config) return;

    const channel = supabaseClient
      .channel(`public:${config.tableName}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: config.tableName 
        }, 
        (payload) => {
          console.log('Real-time update:', payload);
          // Invalidate all queries to trigger refetch
          queryClient.invalidateQueries({ queryKey: ['/api/records'] });
          queryClient.invalidateQueries({ queryKey: ['/api/metrics'] });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [enabled, supabaseClient, config, queryClient]);
}
