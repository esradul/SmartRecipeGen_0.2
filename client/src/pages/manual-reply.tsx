import { AppLayout } from '@/components/layout/AppLayout';
import { ContentWorkflow } from '@/components/workflow/ContentWorkflow';
import { ManualReplyCard } from '@/components/workflow/ManualReplyCard';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import type { N8nRecord } from '@shared/schema';

export default function ManualReply() {
  const { useUpdateRecord } = useSupabaseData();
  const updateRecord = useUpdateRecord();

  const handleUpdateRecord = async (id: number, updates: Partial<N8nRecord>) => {
    await updateRecord.mutateAsync({ id, updates });
  };

  const filter = "manual-reply";

  return (
    <AppLayout title="Manual Reply Workflow">
      <ContentWorkflow
        filter={filter}
        title="Manual Reply"
        emptyMessage="No items require manual replies. All manual handle items have been responded to or there are no items in this workflow."
      >
        {(records, _, isLoading) => (
          <div className="space-y-6" data-testid="manual-reply-cards">
            {records.map((record: N8nRecord) => (
              <ManualReplyCard
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
