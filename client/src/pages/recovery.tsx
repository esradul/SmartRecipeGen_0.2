import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentWorkflow } from '@/components/workflow/ContentWorkflow';
import { RecoveryCard } from '@/components/workflow/RecoveryCard';
import { TimeFilter } from '@/components/dashboard/TimeFilter';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import type { N8nRecord } from '@shared/schema';
import type { TimeRange } from '@/types/database';

export default function Recovery() {
  const { useUpdateRecord } = useSupabaseData();
  const updateRecord = useUpdateRecord();
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
    preset: 'last30d',
  });
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  const handleUpdateRecord = async (id: number, updates: Partial<N8nRecord>) => {
    await updateRecord.mutateAsync({ id, updates });
  };

  const handleRestore = async (id: number) => {
    await handleUpdateRecord(id, {
      removed: false,
      permission: 'Waiting',
    });
  };

  const handleDeletePermanently = async (id: number) => {
    // In a real implementation, this would make a DELETE request to permanently remove the record
    // For now, we'll just mark it as permanently deleted by setting a special flag
    await handleUpdateRecord(id, {
      removed: true,
      // In practice, you might want to add a 'permanently_deleted' field to track this
    });
  };

  const filter = "recovery";

  return (
    <AppLayout title="Data Recovery">
      <div className="space-y-6">
        {/* Time Range Filter */}
        <TimeFilter
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          realTimeEnabled={realTimeEnabled}
          onRealTimeToggle={setRealTimeEnabled}
        />

        <ContentWorkflow
          filter={filter}
          title="Data Recovery"
          emptyMessage="No items found in recovery. All records are active or there are no canceled/removed items in the selected time range."
        >
          {(records, _, isLoading) => (
            <div className="space-y-6" data-testid="recovery-cards">
              {records.map((record: N8nRecord) => (
                <RecoveryCard
                  key={record.id}
                  record={record}
                  onRestore={() => handleRestore(record.id)}
                  onDeletePermanently={() => handleDeletePermanently(record.id)}
                />
              ))}
            </div>
          )}
        </ContentWorkflow>
      </div>
    </AppLayout>
  );
}
