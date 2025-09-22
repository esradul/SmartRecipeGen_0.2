import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TimeFilter } from '@/components/dashboard/TimeFilter';
import { MetricsOverview } from '@/components/dashboard/MetricsOverview';
import { PieCharts } from '@/components/dashboard/PieCharts';
import { ComparisonGraph } from '@/components/dashboard/ComparisonGraph';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useRealTime } from '@/hooks/useRealTime';
import { useSupabase } from '@/contexts/SupabaseProvider';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, MessageSquare, AlertTriangle, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TimeRange, Metrics, ChartData } from '@/types/database';

export default function Dashboard() {
  const { isConfigured } = useSupabase();
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
    preset: 'last30d',
  });
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  const { useMetrics, useRecords } = useSupabaseData();
  
  // Enable real-time updates
  useRealTime(realTimeEnabled && isConfigured);

  const { data: metrics, isLoading: metricsLoading } = useMetrics(timeRange);
  
  // Fetch workflow counts
  const sendGuardQuery = useRecords(
    isConfigured ? "sendguard" : undefined
  );
  const manualReplyQuery = useRecords(
    isConfigured ? "manual-reply" : undefined
  );
  const escalationQuery = useRecords(
    isConfigured ? "escalation" : undefined
  );
  const importantQuery = useRecords(
    isConfigured ? "important" : undefined
  );

  // Calculate chart data
  const permissionData: ChartData[] = metrics ? [
    {
      name: 'Approval',
      value: metrics.approval,
      percentage: metrics.total > 0 ? Math.round((metrics.approval / metrics.total) * 100) : 0,
      color: '#10b981', // green-500
    },
    {
      name: 'Objection',
      value: metrics.objection,
      percentage: metrics.total > 0 ? Math.round((metrics.objection / metrics.total) * 100) : 0,
      color: '#ef4444', // red-500
    },
    {
      name: 'Manual Handle',
      value: metrics.manualHandle,
      percentage: metrics.total > 0 ? Math.round((metrics.manualHandle / metrics.total) * 100) : 0,
      color: '#f59e0b', // amber-500
    },
  ] : [];

  const statusData: ChartData[] = metrics ? [
    {
      name: 'Escalation',
      value: metrics.escalation,
      percentage: metrics.total > 0 ? Math.round((metrics.escalation / metrics.total) * 100) : 0,
      color: '#dc2626', // red-600
    },
    {
      name: 'Cancel',
      value: metrics.cancel,
      percentage: metrics.total > 0 ? Math.round((metrics.cancel / metrics.total) * 100) : 0,
      color: '#6b7280', // gray-500
    },
    {
      name: 'Important',
      value: metrics.important,
      percentage: metrics.total > 0 ? Math.round((metrics.important / metrics.total) * 100) : 0,
      color: '#eab308', // yellow-500
    },
    {
      name: 'Bookcall',
      value: metrics.bookcall,
      percentage: metrics.total > 0 ? Math.round((metrics.bookcall / metrics.total) * 100) : 0,
      color: '#3b82f6', // blue-500
    },
  ] : [];

  const defaultMetrics: Metrics = {
    total: 0,
    messageSent: 0,
    approval: 0,
    objection: 0,
    manualHandle: 0,
    replied: 0,
    escalation: 0,
    cancel: 0,
    important: 0,
    bookcall: 0,
    waiting: 0,
  };

  const workflowCards = [
    {
      href: '/sendguard',
      icon: ShieldCheck,
      title: 'SendGuard',
      description: 'Content moderation queue',
      count: sendGuardQuery.data?.length || 0,
      variant: 'default' as const,
    },
    {
      href: '/manual-reply',
      icon: MessageSquare,
      title: 'Manual Reply',
      description: 'Human responses needed',
      count: manualReplyQuery.data?.length || 0,
      variant: 'default' as const,
    },
    {
      href: '/escalation',
      icon: AlertTriangle,
      title: 'Escalation',
      description: 'Urgent items requiring attention',
      count: escalationQuery.data?.length || 0,
      variant: 'destructive' as const,
    },
    {
      href: '/important',
      icon: Star,
      title: 'Important',
      description: 'High-priority responses',
      count: importantQuery.data?.length || 0,
      variant: 'default' as const,
    },
  ];

  return (
    <AppLayout title="Monitoring Dashboard" lastUpdated="2 mins ago">
      <div className="space-y-6">
        {/* Time Filter Controls */}
        <TimeFilter
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          realTimeEnabled={realTimeEnabled}
          onRealTimeToggle={setRealTimeEnabled}
        />

        {/* Metrics Overview */}
        <MetricsOverview
          metrics={metrics || defaultMetrics}
          isLoading={metricsLoading}
        />

        {/* Charts Section */}
        <PieCharts
          permissionData={permissionData}
          statusData={statusData}
          isLoading={metricsLoading}
        />

        {/* Comparison Graph */}
        <ComparisonGraph isLoading={metricsLoading} />

      </div>
    </AppLayout>
  );
}
