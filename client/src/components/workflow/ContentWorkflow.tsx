import { useState } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useRealTime } from '@/hooks/useRealTime';
import { useSupabase } from '@/contexts/SupabaseProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Database } from 'lucide-react';

interface ContentWorkflowProps {
  filter: string;
  title: string;
  children: (records: any[], updateRecord: any, isLoading: boolean) => React.ReactNode;
  emptyMessage?: string;
}

export function ContentWorkflow({ 
  filter, 
  title, 
  children, 
  emptyMessage = 'No items found.' 
}: ContentWorkflowProps) {
  const { isConfigured } = useSupabase();
  const { useRecords, useUpdateRecord } = useSupabaseData();
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  
  // Enable real-time updates
  useRealTime(realTimeEnabled && isConfigured);
  
  const { data: records = [], isLoading, error } = useRecords(isConfigured ? filter : undefined);
  const updateRecord = useUpdateRecord();

  if (!isConfigured) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" data-testid="unconfigured-state">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Supabase Not Configured
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please configure your Supabase connection to access {title.toLowerCase()} data.
            </p>
            <p className="text-xs text-muted-foreground">
              Use the Configuration option in the user menu to set up your database connection.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" data-testid="error-state">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Failed to Load Data
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error.message}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              data-testid="button-retry"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoading && records.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" data-testid="empty-state">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Items Found
            </h3>
            <p className="text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="content-workflow">
      {/* Real-time toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${realTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm text-muted-foreground">
            Real-time updates {realTimeEnabled ? 'enabled' : 'disabled'}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRealTimeEnabled(!realTimeEnabled)}
          data-testid="button-toggle-realtime"
        >
          {realTimeEnabled ? 'Disable' : 'Enable'} Real-time
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4" data-testid="loading-state">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Content */}
      {!isLoading && children(records, updateRecord, isLoading)}
    </div>
  );
}
