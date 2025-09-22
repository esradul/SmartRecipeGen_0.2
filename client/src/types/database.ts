export interface SupabaseConfig {
  url: string;
  key: string;
  tableName: string;
}

export interface TimeRange {
  start: Date;
  end: Date;
  preset?: 'last24h' | 'last7d' | 'last30d' | 'last90d' | 'custom';
}

export interface Metrics {
  total: number;
  messageSent: number;
  approval: number;
  objection: number;
  manualHandle: number;
  replied: number;
  escalation: number;
  cancel: number;
  important: number;
  bookcall: number;
  waiting: number;
}

export interface ChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}
