import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/contexts/SupabaseProvider';
import type { N8nRecord, UpdateN8nRecord } from '@shared/schema';
import type { TimeRange, Metrics } from '@/types/database';

export function useSupabaseData() {
  const { supabaseClient, config } = useSupabase();
  const queryClient = useQueryClient();

  const fetchRecords = async (filter?: string): Promise<N8nRecord[]> => {
    if (!supabaseClient || !config) {
      throw new Error('Supabase not configured');
    }

    let query = supabaseClient.from(config.tableName).select('*');
    
    if (filter) {
      // Apply the filter based on common workflow patterns
      switch (filter) {
        case 'sendguard':
          query = query.or('and(permission.eq.Waiting,removed.is.false),and(permission.eq.Objection,Objection_nai.is.true,removed.is.false)');
          break;
        case 'manual-reply':
          query = query.eq('permission', 'Manual Handle').eq('replied', false).eq('removed', false);
          break;
        case 'escalation':
          query = query.eq('escalation', true).eq('Escalated_replied', false).eq('removed', false);
          break;
        case 'important':
          query = query.eq('important', true).eq('Important_replied', false).eq('removed', false);
          break;
        case 'recovery':
          query = query.or('permission.eq.Cancel,removed.eq.true');
          break;
        default:
          // For custom filters, use the raw filter string
          query = query.or(filter);
          break;
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch records: ${error.message}`);
    }
    
    return data || [];
  };

  const updateRecord = async (id: number, updates: UpdateN8nRecord): Promise<N8nRecord> => {
    if (!supabaseClient || !config) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabaseClient
      .from(config.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update record: ${error.message}`);
    }

    return data;
  };

  const calculateMetrics = async (timeRange: TimeRange): Promise<Metrics> => {
    if (!supabaseClient || !config) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabaseClient
      .from(config.tableName)
      .select('*')
      .gte('created_at', timeRange.start.toISOString())
      .lte('created_at', timeRange.end.toISOString());

    if (error) {
      throw new Error(`Failed to calculate metrics: ${error.message}`);
    }

    const records = data || [];
    
    return {
      total: records.length,
      messageSent: records.filter(r => r.message_sent === true).length,
      approval: records.filter(r => r.permission === 'Approval').length,
      objection: records.filter(r => r.permission === 'Objection').length,
      manualHandle: records.filter(r => r.permission === 'Manual Handle').length,
      replied: records.filter(r => r.replied === true).length,
      escalation: records.filter(r => r.escalation === true).length,
      cancel: records.filter(r => r.permission === 'Cancel').length,
      important: records.filter(r => r.important === true).length,
      bookcall: records.filter(r => r.bookcall === true).length,
      waiting: records.filter(r => r.permission === 'Waiting').length,
    };
  };

  const useRecords = (filter?: string) => {
    return useQuery({
      queryKey: ['/api/records', filter],
      queryFn: () => fetchRecords(filter),
      enabled: !!supabaseClient && !!config,
      refetchInterval: 30000, // Refetch every 30 seconds
    });
  };

  const useMetrics = (timeRange: TimeRange) => {
    return useQuery({
      queryKey: ['/api/metrics', timeRange],
      queryFn: () => calculateMetrics(timeRange),
      enabled: !!supabaseClient && !!config,
      refetchInterval: 30000,
    });
  };

  const useUpdateRecord = () => {
    return useMutation({
      mutationFn: ({ id, updates }: { id: number; updates: UpdateN8nRecord }) =>
        updateRecord(id, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/records'] });
        queryClient.invalidateQueries({ queryKey: ['/api/metrics'] });
      },
    });
  };

  return {
    useRecords,
    useMetrics,
    useUpdateRecord,
  };
}
