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

export interface ApprovalAuditLogEntry {
  id: string;
  timestamp: string;
  action: 'CREATED' | 'STATUS_CHANGED' | 'PRIORITY_ESCALATED' | 'SLA_WARNING' | 'APPROVED' | 'REJECTED' | 'REASSIGNED' | 'DOCUMENT_ATTACHED';
  actor: string;
  actorRole: string;
  actorDepartment: string;
  actorIp?: string;
  fromStatus?: 'Pending' | 'Approved' | 'Rejected' | 'Draft';
  toStatus?: 'Pending' | 'Approved' | 'Rejected';
  reason?: string;
  complianceSignoff?: boolean;
  checksum?: string;
  evidenceRef?: string;
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
  pendingHours?: number;
  pendingTrend?: number[];
  auditLogs?: ApprovalAuditLogEntry[];
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

export interface DataAnomalyItem {
  id: string;
  timestamp: string;
  vendor: string;
  plant: string;
  metric: string;
  submittedValue: string;
  expectedRange: string;
  anomalyType: 'Range Outlier' | 'Cross-Metric Mismatch' | 'Sudden Spike' | 'Sensor Dropout' | 'Duplicate Submission' | 'Temporal Continuity';
  severity: 'Critical' | 'Warning' | 'Info';
  status: 'Under Review' | 'Quarantined' | 'Approved' | 'Rejected';
  explanation?: string;
  confidenceScore: number;
}

export interface RuleParameterConfig {
  key: string;
  name: string;
  value: string | number | boolean;
  defaultValue: string | number | boolean;
  unit?: string;
  description: string;
  dataType: 'number' | 'string' | 'boolean' | 'percentage';
  min?: number;
  max?: number;
  isEditable?: boolean;
}

export interface RuleExecutionResult {
  runId: string;
  timestamp: string;
  durationMs: number;
  batchId: string;
  recordsEvaluated: number;
  passedCount: number;
  violationCount: number;
  passRate: number;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  summaryMessage: string;
  logSnippet?: string;
}

export type RuleCategory =
  | 'Physical Limit'
  | 'Business Logic'
  | 'Statistical Outlier'
  | 'Temporal Continuity'
  | 'Schema & Types';

export interface RuleGroupExecutionSummary {
  group: RuleCategory;
  groupNameVi: string;
  description: string;
  iconName?: string;
  rulesCount: number;
  activeRulesCount: number;
  lastExecution: RuleExecutionResult;
  history?: RuleExecutionResult[];
}

export interface ValidationRule {
  id: string;
  name: string;
  category: RuleCategory;
  ruleDescription: string;
  threshold: string;
  active: boolean;
  violationsCount: number;
  severity?: 'BLOCKER' | 'CRITICAL' | 'WARNING' | 'INFO';
  autoQuarantine?: boolean;
  lastExecuted?: string;
  passCount?: number;
  kpiCode?: string;
  // Enhanced configuration parameters & execution stats
  parameters?: RuleParameterConfig[];
  expression?: string;
  executionMode?: 'REALTIME_INGEST' | 'MICRO_BATCH' | 'SCHEDULED';
  lastResult?: RuleExecutionResult;
  lastBatchId?: string;
  targetTables?: string[];
  owner?: string;
  lastModified?: string;
}

// Enterprise KPI Data Quality Control Center Types
export type QuarantineStatus =
  | 'NEW'
  | 'QUARANTINED'
  | 'UNDER_REVIEW'
  | 'WAITING_FOR_SOURCE'
  | 'RESUBMISSION_REQUIRED'
  | 'REVALIDATION_PENDING'
  | 'RESOLVED'
  | 'REJECTED'
  | 'APPROVED_EXCEPTION';

export type RuleSeverity = 'BLOCKER' | 'CRITICAL' | 'WARNING' | 'INFO';

export type DataTrustStatus =
  | 'VERIFIED_REAL'
  | 'SIMULATED_DATA'
  | 'NOT_CONNECTED'
  | 'NOT_VERIFIED'
  | 'CONNECTION_ERROR'
  | 'STALE_DATA';

export type UserRole = 'EXECUTIVE' | 'DATA_STEWARD' | 'PLANT_QA' | 'IT_ADMIN';

export interface AuditHistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  actorRole: UserRole;
  fromStatus?: QuarantineStatus;
  toStatus?: QuarantineStatus;
  notes?: string;
}

export interface ApprovalRecord {
  approverName: string;
  approverRole: UserRole;
  approvalTimestamp: string;
  justification: string;
  validUntil: string;
  scope: string; // e.g. "Shift 1 - Line 6 Only"
  approvedExceptionRef: string;
}

export interface QuarantineRecord {
  id: string; // Record ID e.g. QR-2025-0891
  batchId: string; // Batch ID e.g. BATCH-GMES-20250425-03
  sourceSystem: 'GMES' | 'IoT_Gateway' | 'SAP_ERP' | 'QA_Manual_Upload' | 'RPA_Crawler' | 'Supplier_API';
  sourceRecordId: string; // ID inside source e.g. MES-TXN-90218
  kpiCode: 'OEE' | 'OTD' | 'QUALITY_YIELD' | 'EQUIPMENT_UPTIME' | 'MANPOWER_EFF' | 'SCRAP_RATE';
  reportingPeriod: string; // e.g. "2025-W17 (Shift 1)"
  factory: string; // e.g. "Plant 1 - Bac Ninh"
  line: string; // e.g. "SMT Line 06"
  equipment: string; // e.g. "Mounter NXT-III #2"
  vendor: string; // e.g. "KTECH"
  originalValue: string; // Raw input from source
  normalizedValue: string; // Standardized internal representation
  expectedRange: string; // Reference truth boundary
  validationRuleId: string; // e.g. "RULE-01"
  violationDescription: string;
  severity: RuleSeverity;
  detectionTimestamp: string;
  evidenceRef: string; // File reference or transaction log ID
  evidencePayload?: Record<string, any>;
  evidenceLogSnippet?: string;
  assignedOwner: string;
  ownerEmail?: string;
  resolutionSlaHours: number;
  slaDeadline: string;
  isSlaBreached: boolean;
  currentStatus: QuarantineStatus;
  resolutionNote?: string;
  approvalRecord?: ApprovalRecord;
  history: AuditHistoryEntry[];
  canCreatorApprove?: boolean;
}

export interface SourceSystemHealth {
  id: string;
  name: string;
  protocol: 'OPC-UA' | 'MQTT' | 'REST_JSON' | 'SFTP_CSV' | 'SAP_RFC' | 'WEBHOOK';
  connectionStatus: 'CONNECTED' | 'INTERMITTENT' | 'OFFLINE';
  dataQualityHealth: 'EXCELLENT' | 'WARNINGS' | 'CRITICAL_QUARANTINE' | 'STALE';
  lastSyncTimestamp: string;
  expectedRecords: number;
  receivedRecords: number;
  driftPercentage: number;
  lastValidationStatus: 'PASSED' | 'WARNINGS_DETECTED' | 'ERRORS_QUARANTINED';
  unresolvedErrorsCount: number;
  sourceOwner: string;
  ownerContact: string;
  dataTrustLabel: DataTrustStatus;
  averageLatencyMs: number;
  preflightStatus: 'HEALTHY' | 'NEEDS_ATTENTION' | 'FAILED';
  description: string;
}

export interface GlobalFilterState {
  timeRange: string; // 'today' | '7d' | '30d' | '90d'
  reportingPeriod: string; // 'all' | 'shift1' | 'shift2' | 'shift3' | 'weekly' | 'monthly'
  sourceSystem: string; // 'all' | system id
  factory: string; // 'all' | factory id
  line: string; // 'all' | line id
  equipment: string; // 'all' | equipment id
  vendor: string; // 'all' | vendor id
  kpiGroup: string; // 'all' | 'oee' | 'otd' | 'quality' | 'equipment' | 'manpower'
  ingestionMethod: string; // 'all' | 'realtime' | 'batch' | 'manual'
  validationStatus: string; // 'all' | 'pass' | 'warning' | 'quarantined'
}

export interface ReconciliationBatch {
  batchId: string;
  sourceSystem: string;
  timestamp: string;
  rawReceived: number;
  rawStaged: number;
  normalized: number;
  validationPassed: number;
  quarantined: number;
  kpiCommitted: number;
  reconciliationStatus: '100%_BALANCED' | 'DISCREPANCY_DETECTED' | 'IN_PROGRESS';
  discrepancyCount: number;
}

export interface ManualEntryRecord {
  id: string;
  timestamp: string;
  plant: string;
  line: string;
  station: string;
  shift: string;
  date: string;
  workOrderId: string;
  planQty: number;
  actualQty: number;
  scrapQty: number;
  reworkQty: number;
  downtimeMinutes: number;
  downtimeReason: string;
  headcount: number;
  inspectorName: string;
  inspectorBadgeId: string;
  notes: string;
  validationStatus: 'PASS' | 'WARNING' | 'BLOCKER';
  violationMessage?: string;
  provenanceTag: 'MANUAL_ENTRY' | 'FILE_IMPORT';
}

export interface ManualBatchSubmission {
  batchId: string;
  timestamp: string;
  method: 'FORM_DIRECT' | 'CSV_UPLOAD';
  plant: string;
  operator: string;
  totalRecords: number;
  validRecords: number;
  quarantinedRecords: number;
  status: 'COMMITTED' | 'QUARANTINED' | 'VALIDATING';
  summary: string;
}

export type BottleneckCategory =
  | 'EQUIPMENT_FAILURE'
  | 'MATERIAL_STOCKOUT'
  | 'QUALITY_DRIFT'
  | 'MANPOWER_SHORTAGE'
  | 'CAPACITY_OVERLOAD';

export interface PredictiveBottleneckMetric {
  label: string;
  value: string;
  trend: 'worsening' | 'stable' | 'improving';
  benchmark: string;
  status: 'critical' | 'warning' | 'normal';
}

export interface PredictiveBottleneckAlert {
  id: string;
  vendorId: string;
  vendorName: string;
  plantName: string;
  bottleneckType: BottleneckCategory;
  title: string;
  probability: number; // 0 - 100%
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  timeHorizonHours: number; // e.g. 4
  timeHorizonLabel: string; // e.g. "Trong 4h tới"
  historicalRootCause: string;
  historicalMetricsSummary: PredictiveBottleneckMetric[];
  predictedImpact: string;
  suggestedAction: string;
  actionPayload?: string;
  confidenceScore: number;
  modelEngine: string;
  lastTrainedDate: string;
}


