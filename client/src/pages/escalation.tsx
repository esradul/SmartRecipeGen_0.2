import { AppLayout } from '@/components/layout/AppLayout';
import { ContentWorkflow } from '@/components/workflow/ContentWorkflow';
import { EscalationCard } from '@/components/workflow/EscalationCard';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import type { N8nRecord } from '@shared/schema';

export default function Escalation() {
  const { useUpdateRecord } = useSupabaseData();
  const updateRecord = useUpdateRecord();

  const handleUpdateRecord = async (id: number, updates: Partial<N8nRecord>) => {
    await updateRecord.mutateAsync({ id, updates });
  };

  const filter = "escalation";

  return (
    <AppLayout title="Escalation Workflow">
      <ContentWorkflow
        filter={filter}
        title="Escalation"
        emptyMessage="No escalated items require attention. All escalations have been resolved or there are no items requiring escalation."
      >
        {(records, _, isLoading) => (
          <div className="space-y-6" data-testid="escalation-cards">
            {records.map((record: N8nRecord) => (
              <EscalationCard
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
