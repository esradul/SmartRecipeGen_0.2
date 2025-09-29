import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { TimeRange } from '@/types/database';

interface ComparisonData {
  name: string;
  current: number;
  previous: number;
  difference: number;
  percentageChange: number;
}

interface ComparisonGraphProps {
  isLoading?: boolean;
}

export function ComparisonGraph({ isLoading }: ComparisonGraphProps) {
  const [selectedMetric, setSelectedMetric] = useState('total');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data for demonstration
  const comparisonData: ComparisonData[] = [
    { name: 'Week 1', current: 450, previous: 380, difference: 70, percentageChange: 18.4 },
    { name: 'Week 2', current: 520, previous: 410, difference: 110, percentageChange: 26.8 },
    { name: 'Week 3', current: 480, previous: 440, difference: 40, percentageChange: 9.1 },
    { name: 'Week 4', current: 600, previous: 500, difference: 100, percentageChange: 20.0 },
  ];

  const summaryMetrics = {
    current: 2050,
    previous: 1730,
    difference: 320,
    percentageChange: 18.5,
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const metricOptions = [
    { value: 'total', label: 'Total Messages' },
    { value: 'approval', label: 'Approvals' },
    { value: 'objection', label: 'Objections' },
    { value: 'manual', label: 'Manual Handle' },
  ];

  if (isLoading || isGenerating) {
    return (
      <Card data-testid="card-comparison-graph">
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary border-t-accent animate-spin"></div>
              <p className="text-muted-foreground">
                {isGenerating ? 'Generating comparison chart...' : 'Loading chart data...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-comparison-graph">
      <CardHeader>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-6">
          <CardTitle className="mb-4 xl:mb-0">Performance Comparison</CardTitle>
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-comparison-metric">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {metricOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={(value: 'line' | 'bar') => setChartType(value)}>
              <SelectTrigger className="w-full md:w-32" data-testid="select-chart-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerate} className="w-full md:w-auto" data-testid="button-generate-comparison">
              Generate Comparison
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Comparison Chart */}
        <div className="h-64 sm:h-80" data-testid="comparison-chart">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ComparisonData;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{label}</p>
                          <p className="text-blue-600">Current: {data.current}</p>
                          <p className="text-gray-600">Previous: {data.previous}</p>
                          <p className="text-green-600">Difference: +{data.difference} ({data.percentageChange}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Current Period"
                />
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Previous Period"
                />
              </LineChart>
            ) : (
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="hsl(var(--primary))" name="Current Period" />
                <Bar dataKey="previous" fill="hsl(var(--muted-foreground))" name="Previous Period" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Metric Summary Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6" data-testid="comparison-summary">
          <Card className="bg-secondary">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Current Period</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-current-period">
                {summaryMetrics.current.toLocaleString()}
              </p>
              <p className="text-xs text-green-600">+{summaryMetrics.difference} vs previous</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Previous Period</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-previous-period">
                {summaryMetrics.previous.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Baseline</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Change</p>
              <p className="text-2xl font-bold text-green-600" data-testid="text-percentage-change">
                +{summaryMetrics.percentageChange}%
              </p>
              <p className="text-xs text-muted-foreground">Growth rate</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
