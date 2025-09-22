import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartData } from '@/types/database';

interface PieChartsProps {
  permissionData: ChartData[];
  statusData: ChartData[];
  isLoading?: boolean;
}

export function PieCharts({ permissionData, statusData, isLoading }: PieChartsProps) {
  const renderCustomLabel = ({ name, value, percentage }: ChartData) => {
    return `${name}: ${value} (${percentage}%)`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} data-testid={`skeleton-chart-${index}`}>
            <CardHeader>
              <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" data-testid="pie-charts">
      {/* Permission Status Pie Chart */}
      <Card data-testid="card-permission-chart">
        <CardHeader>
          <CardTitle>Permission Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={permissionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {permissionData.map((entry, index) => (
                    <Cell key={`permission-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2" data-testid="permission-legend">
            {permissionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium" data-testid={`text-permission-${item.name.toLowerCase().replace(' ', '-')}`}>
                  {item.value.toLocaleString()} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overall Status Pie Chart */}
      <Card data-testid="card-status-chart">
        <CardHeader>
          <CardTitle>Overall Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`status-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2" data-testid="status-legend">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium" data-testid={`text-status-${item.name.toLowerCase().replace(' ', '-')}`}>
                  {item.value.toLocaleString()} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
