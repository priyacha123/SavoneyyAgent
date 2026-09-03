import {
  Zap,
  BarChart2,
  Database,
  Sparkles,
  Clock,
  Lock,
  Github,
  Twitter,
  Mail,
  LinkedinIcon,
  LayoutDashboard,
  History,
  CreditCard,
  Settings,
  ShieldCheck,
  FileSpreadsheet,
  Building2,
  Landmark,
  XCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { DataSource, Plan } from "./types";

export const features = [
  {
    icon: Zap,
    title: "3-Way Automated Matching",
    description:
      "Deterministic matching across Razorpay settlements, bank credit advices, and ERP GL entries — in one engine.",
  },
  {
    icon: Sparkles,
    title: "Gemini AI Exception Reasoner",
    description:
      "Every unmatched record gets a natural-language audit diagnosis powered by Google Gemini AI — no manual review needed.",
  },
  {
    icon: BarChart2,
    title: "Real-Time Discrepancy Matrix",
    description:
      "Live heatmap view of amount mismatches across all three data sources. Spot the problem before your auditor does.",
  },
  {
    icon: Database,
    title: "Multi-Feed Ingestion",
    description:
      "Connect Razorpay API, bank SFTP feeds, and ERP webhooks simultaneously. New sources in under 5 minutes.",
  },
  {
    icon: Clock,
    title: "Scheduled Batch Runs",
    description:
      "Auto-trigger reconciliation hourly, daily, or on every settlement push. Full audit trail per run.",
  },
  {
    icon: Lock,
    title: "Enterprise-Grade Audit Logs",
    description:
      "Every match decision, variance, and exception is logged with timestamps, confidence scores, and AI reasoning.",
  },
];

export const plans = [
  { name: "Starter", price: "₹999", records: "5,000 records/batch", cta: "Get Started" },
  { name: "Pro", price: "₹2,999", records: "50,000 records/batch", cta: "Start Pro Trial", highlight: true },
  { name: "Enterprise", price: "₹9,999", records: "Unlimited records", cta: "Contact Sales" },
];

export const works = [
  { step: "01", title: "Ingest Sources", desc: "Pull Razorpay settlement CSV, bank SFTP credit advice, and ERP GL export automatically." },
  { step: "02", title: "3-Way Match", desc: "Deterministic engine cross-checks TxnID, Amount, UTR, and OrderID across all three sources." },
  { step: "03", title: "AI Exception Triage", desc: "Unmatched records routed to Gemini AI which generates a plain-English audit diagnosis." },
  { step: "04", title: "Audit & Export", desc: "Full audit trail with confidence scores, exception reports, and one-click CSV export for finance teams." },
]

export const lists = ["3-way reconciliation engine", "Gemini AI Exception Reasoner", "Razorpay Billing Integration", "Audit Trail & Export"]

export const icons = [
  { icon: Github, label: "GitHub", href: "https://github.com/priyacha123" },
  { icon: Twitter, label: "Twitter", href: "https://x.com/textrovert_39" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "https://www.linkedin.com/in/priyakumari2109" },
  { icon: Mail, label: "Email", href: "mailto:chaudhary21priya@gmail.com" },
]

export const navItems = [
  {
    name: "Reconciliation Workbench",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Batch History & Analytics",
    href: "/dashboard/history",
    icon: History,
  },
  {
    name: "Connected Data Feeds",
    href: "/dashboard/sources",
    icon: Database,
  },
  {
    name: "Razorpay Billing & Plans",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    name: "Engine Rules & Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const sideNavItems = [
  {
    name: "Reconciliation Workbench",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Batch History & Analytics",
    href: "/dashboard/history",
    icon: History,
  },
  {
    name: "Connected Data Feeds",
    href: "/dashboard/sources",
    icon: Database,
  },
  {
    name: "Razorpay Billing & Plans",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    name: "Engine Rules & Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99900,
    priceLabel: "₹999",
    description: "For early-stage fintechs and solo operators testing reconciliation workflows.",
    icon: Zap,
    features: [
      "Up to 5,000 records / batch",
      "1 Gateway Integration",
      "1 Bank Feed",
      "Manual Trigger Only",
      "7-day log retention",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 299900,
    priceLabel: "₹2,999",
    description: "For growing payment operations teams running daily automated reconciliation.",
    icon: ShieldCheck,
    features: [
      "Up to 50,000 records / batch",
      "3 Gateway Integrations",
      "3 Bank Feeds",
      "Scheduled + Webhook Triggers",
      "Gemini AI Exception Reasoner",
      "30-day log retention",
      "Priority email + Slack support",
    ],
    highlight: true,
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 999900,
    priceLabel: "₹9,999",
    description: "For large enterprises needing unlimited throughput, custom integrations, and SLAs.",
    icon: Building2,
    features: [
      "Unlimited records",
      "Unlimited Integrations",
      "Dedicated Razorpay Account Manager",
      "Custom matching rules engine",
      "Real-time streaming reconciliation",
      "90-day audit log retention",
      "24×7 phone + SLA support",
    ],
  },
];


export const SOURCES: DataSource[] = [
  {
    id: "rzp-gateway",
    name: "Razorpay Settlement Reports",
    type: "gateway",
    status: "connected",
    lastSync: "2 minutes ago",
    recordCount: 8_420,
    description: "Live settlement payout reports from the Razorpay Payment Gateway API. Auto-pulled every 15 min.",
    icon: FileSpreadsheet,
  },
  {
    id: "hdfc-bank",
    name: "HDFC Bank — Credit Advice Feed",
    type: "bank",
    status: "connected",
    lastSync: "18 minutes ago",
    recordCount: 7_891,
    description: "Automated Bank Statement / Credit Advice XML feed via SFTP. Covers HDFC Nodal Account.",
    icon: Landmark,
  },
  {
    id: "erp-ledger",
    name: "ERP General Ledger (SAP B1)",
    type: "erp",
    status: "syncing",
    lastSync: "Syncing…",
    recordCount: 8_011,
    description: "SAP Business One GL export pushed via secure REST webhook on each posting batch.",
    icon: Building2,
  },
  {
    id: "kotak-bank",
    name: "Kotak Mahindra — Bank Credit Feed",
    type: "bank",
    status: "disconnected",
    lastSync: "3 days ago",
    recordCount: 0,
    description: "Secondary bank account credit advice feed. Currently disconnected — re-authorize credentials.",
    icon: Landmark,
  },
];

export const DEFAULT_SETTINGS = [
  { label: "Connected", value: "connected", color: "text-emerald-700", icon: CheckCircle2 },
  { label: "Syncing", value: "syncing", color: "text-blue-700", icon: RefreshCw },
  { label: "Disconnected", value: "disconnected", color: "text-red-700", icon: XCircle },
  { label: "Total Records", value: "totalRecords".toLocaleString(), color: "text-slate-800", icon: Database },
]

export const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Reconciliation Workbench",
  "/dashboard/history": "Batch History & Analytics",
  "/dashboard/sources": "Connected Data Feeds",
  "/dashboard/billing": "Razorpay Billing & Plans",
  "/dashboard/settings": "Engine Rules & Settings",
};