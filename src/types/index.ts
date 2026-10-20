export type Language = 'VI' | 'EN' | 'KR';

export interface VendorMetric {
  id: string;
  vendor: string;
  production: number;
  productionTrend: 'up' | 'down' | 'flat' | 'square';
  onTime: number;
  onTimeTrend: 'up' | 'down' | 'flat' | 'square';
  quality: number;
  qualityTrend: 'up' | 'down' | 'flat' | 'square';
  equipment: number;
  equipmentTrend: 'up' | 'down' | 'flat' | 'square';
  manpower: number;
  manpowerTrend: 'up' | 'down' | 'flat' | 'square';
  status: 'On Track' | 'At Risk' | 'Critical';
  score: number;
  lat: number;
  lng: number;
  location: string;
}

export interface IssueItem {
  id: number;
  date: string;
  vendor: string;
  category: 'Equipment' | 'Material' | 'Quality' | 'Manpower' | 'Delivery';
  issue: string;
  status: 'Open' | 'In Progress' | 'Monitoring' | 'Resolved';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface ApprovalAction {
  id: number;
  type: string;
  description: string;
  requestedBy: string;
  date: string;
  approved?: boolean;
  status?: 'Pending' | 'Approved' | 'Rejected';
  priority?: 'High' | 'Medium' | 'Low';
}

export interface MilestoneItem {
  id: number;
  date: string;
  milestone: string;
  vendor: string;
  status: 'On Track' | 'Planned' | 'At Risk';
}

export interface PlantStatus {
  id: string;
  name: string;
  status: 'Running' | 'Material Delay' | 'Machine Stop' | 'Quality Check';
  statusColor: 'green' | 'amber' | 'red';
  lines: string;
  image: string;
}

export interface AIInsight {
  id: number;
  type: 'production' | 'delivery' | 'equipment' | 'quality' | 'suggestion';
  iconType: 'trend' | 'alert' | 'critical' | 'info' | 'sparkle';
  iconColor: string;
  text: string;
  highlightVendors?: string[];
  suggestedAction?: string;
}

export interface ChartDataPoint {
  date: string;
  plan: number;
  actual: number;
  yieldRate: number;
}
