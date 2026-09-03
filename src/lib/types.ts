export interface Plan {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  highlight?: boolean;
  badge?: string;
}

export interface Subscription {
  planId: string;
  planName: string;
  status: string;
  nextBilling: string | null;
  orderId: string | null;
  subscriptionId: string | null;
  amount: number;
}

export interface BatchRun {
  id: string;
  batchId: string;
  startedAt: string;
  completedAt: string | null;
  totalRecords: number;
  matchedCount: number;
  varianceCount: number;
  exceptionCount: number;
  status: string;
}

export interface EngineSettings {
  matchTolerancePercent: number;
  utrRequiredForMatch: boolean;
  geminiAiEnabled: boolean;
  geminiReasoningThreshold: number;
  autoRunSchedule: string;
  notifyOnException: boolean;
  notifyEmail: string;
  webhookUrl: string;
  apiKeyMasked: string;
}

export const defaultSettings: EngineSettings = {
  matchTolerancePercent: 0.5,
  utrRequiredForMatch: true,
  geminiAiEnabled: true,
  geminiReasoningThreshold: 60,
  autoRunSchedule: "daily",
  notifyOnException: true,
  notifyEmail: "ops@yourcompany.com",
  webhookUrl: "",
  apiKeyMasked: "sk-•••••••••••••••••••••••••••",
};

export interface DataSource {
  id: string;
  name: string;
  type: "gateway" | "bank" | "erp";
  status: "connected" | "disconnected" | "syncing";
  lastSync: string;
  recordCount: number;
  description: string;
  icon: React.ElementType;
}

export interface AuditDetailModalProps {
  log: any | null;
  onClose: () => void;
}

export interface DiscrepancyMatrixCardProps {
  matrix: Record<string, { total: number; detected: number; recallPercentage: number }> | null;
}

export interface MetricCardsProps {
  metrics: {
    totalRecords: number;
    matchedCount: number;
    varianceCount: number;
    exceptionCount: number;
    matchRate: number;
    precision: number;
    recall: number;
    falsePositiveRate: number;
    f1Score: number;
  } | null;
}

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NavbarProps {
  onRunBatch: () => void;
  onSeedData: () => void;
  isLoading: boolean;
}