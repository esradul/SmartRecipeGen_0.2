import { TrendingUp, TrendingDown, Mail, Send, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Metrics } from '@/types/database';

interface MetricsOverviewProps {
  metrics: Metrics;
  isLoading?: boolean;
}

export function MetricsOverview({ metrics, isLoading }: MetricsOverviewProps) {
  const metricCards = [
    {
      title: 'Total Messages',
      value: metrics.total,
      icon: Mail,
      trend: 12.5,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Messages Sent',
      value: metrics.messageSent,
      icon: Send,
      trend: 8.2,
      color: 'bg-accent/10 text-accent',
    },
    {
      title: 'Approvals',
      value: metrics.approval,
      icon: CheckCircle,
      trend: 15.3,
      color: 'bg-green-500/10 text-green-600 dark:text-green-500',
    },
    {
      title: 'Escalations',
      value: metrics.escalation,
      icon: AlertTriangle,
      trend: 3.1,
      isNegative: false, // Escalations increasing is concerning but we show the trend as-is
      color: 'bg-red-500/10 text-red-600 dark:text-red-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="metric-card" data-testid={`skeleton-metric-card-${index}`}>
            <CardContent className="p-4 lg:p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6" data-testid="metrics-overview">
      {metricCards.map(({ title, value, icon: Icon, trend, color }) => (
        <Card key={title} className="metric-card" data-testid={`card-metric-${title.toLowerCase().replace(' ', '-')}`}>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground" data-testid={`text-metric-value-${title.toLowerCase().replace(' ', '-')}`}>
                  {value.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1 flex items-center flex-wrap">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{trend}% from last period</span>
                </p>
              </div>
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={18} className="lg:w-5 lg:h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
