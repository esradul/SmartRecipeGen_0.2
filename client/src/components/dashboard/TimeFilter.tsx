import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { TimeRange } from '@/types/database';

interface TimeFilterProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  realTimeEnabled: boolean;
  onRealTimeToggle: (enabled: boolean) => void;
}

export function TimeFilter({
  timeRange,
  onTimeRangeChange,
  realTimeEnabled,
  onRealTimeToggle,
}: TimeFilterProps) {
  const [preset, setPreset] = useState<string>(timeRange.preset || 'last30d');

  const handlePresetChange = (value: string) => {
    setPreset(value);
    
    const now = new Date();
    const start = new Date();
    
    switch (value) {
      case 'last24h':
        start.setHours(now.getHours() - 24);
        break;
      case 'last7d':
        start.setDate(now.getDate() - 7);
        break;
      case 'last30d':
        start.setDate(now.getDate() - 30);
        break;
      case 'last90d':
        start.setDate(now.getDate() - 90);
        break;
      default:
        return; // Custom range
    }
    
    onTimeRangeChange({
      start,
      end: now,
      preset: value as TimeRange['preset'],
    });
  };

  const handleDateChange = (field: 'start' | 'end', date: Date | undefined) => {
    if (!date) return;
    
    onTimeRangeChange({
      ...timeRange,
      [field]: date,
      preset: 'custom',
    });
    setPreset('custom');
  };

  return (
    <Card data-testid="card-time-filter">
      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-4 xl:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div>
              <Label className="text-sm font-medium text-foreground">Time Range</Label>
              <Select value={preset} onValueChange={handlePresetChange}>
                <SelectTrigger className="w-full md:w-48 mt-2" data-testid="select-time-range">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last24h">Last 24 hours</SelectItem>
                  <SelectItem value="last7d">Last 7 days</SelectItem>
                  <SelectItem value="last30d">Last 30 days</SelectItem>
                  <SelectItem value="last90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {preset === 'custom' && (
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div>
                  <Label className="text-sm font-medium text-foreground">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full sm:w-48 mt-2 justify-start text-left font-normal"
                        data-testid="button-start-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(timeRange.start, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={timeRange.start}
                        onSelect={(date) => handleDateChange('start', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-foreground">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full sm:w-48 mt-2 justify-start text-left font-normal"
                        data-testid="button-end-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(timeRange.end, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={timeRange.end}
                        onSelect={(date) => handleDateChange('end', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Switch
                id="realtime-toggle"
                checked={realTimeEnabled}
                onCheckedChange={onRealTimeToggle}
                data-testid="switch-realtime"
              />
              <Label htmlFor="realtime-toggle" className="text-sm font-medium whitespace-nowrap">
                Real-time updates
              </Label>
            </div>
            <Button
              onClick={() => {
                // Force refresh - in a real app you might want to trigger a manual refetch
                window.location.reload();
              }}
              className="px-4 py-2 w-full sm:w-auto"
              data-testid="button-apply-filters"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
