import { AppLayout } from '@/components/layout/AppLayout';
import { ContentWorkflow } from '@/components/workflow/ContentWorkflow';
import { SendGuardCard } from '@/components/workflow/SendGuardCard';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import type { N8nRecord } from '@shared/schema';

export default function SendGuard() {
  const { useUpdateRecord } = useSupabaseData();
  const updateRecord = useUpdateRecord();

  const handleUpdateRecord = async (id: number, updates: Partial<N8nRecord>) => {
    await updateRecord.mutateAsync({ id, updates });
  };

  const filter = "sendguard";

  return (
    <AppLayout title="SendGuard Workflow">
      <ContentWorkflow
        filter={filter}
        title="SendGuard"
        emptyMessage="No items in SendGuard queue. All content has been processed or there are no new items waiting for moderation."
      >
        {(records, _, isLoading) => (
          <div className="space-y-6" data-testid="sendguard-cards">
            {records.map((record: N8nRecord) => (
              <SendGuardCard
                key={record.id}
                record={record}
                onUpdate={handleUpdateRecord}
              />
            ))}
          </div>
        )}
      </ContentWorkflow>
    </AppLayout>
  );
}
