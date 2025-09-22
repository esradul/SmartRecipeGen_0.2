import { AppLayout } from '@/components/layout/AppLayout';
import { ContentWorkflow } from '@/components/workflow/ContentWorkflow';
import { ImportantCard } from '@/components/workflow/ImportantCard';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import type { N8nRecord } from '@shared/schema';

export default function Important() {
  const { useUpdateRecord } = useSupabaseData();
  const updateRecord = useUpdateRecord();

  const handleUpdateRecord = async (id: number, updates: Partial<N8nRecord>) => {
    await updateRecord.mutateAsync({ id, updates });
  };

  const filter = "important";

  return (
    <AppLayout title="Important Workflow">
      <ContentWorkflow
        filter={filter}
        title="Important"
        emptyMessage="No important items require responses. All high-priority items have been handled or there are no items marked as important."
      >
        {(records, _, isLoading) => (
          <div className="space-y-6" data-testid="important-cards">
            {records.map((record: N8nRecord) => (
              <ImportantCard
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
