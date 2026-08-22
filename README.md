# Savoneyy — AI-Powered Multi-Source Financial Reconciliation Engine

> **Razorpay AI Buildathon — Track 4: Finance Operations**
> A SaaS platform that automates 3-way payment reconciliation across Gateway settlements, Bank credit advices, and ERP ledger entries — powered by Google Gemini AI for exception diagnosis.

---

## What Is This?

Savoneyy is a production-ready SaaS reconciliation system that solves one of finance operations' most painful problems: **chasing payment mismatches across multiple data sources**.

In a typical payment workflow, three systems must always agree:

| Source | What It Contains |
|---|---|
| **Razorpay Settlement Report** | What the payment gateway paid out to your bank |
| **Bank Credit Advice** | What your bank actually received (with a UTR reference) |
| **ERP / Accounting Ledger** | What your accounting system has recorded |

When these three don't match — due to delayed credits, fee deductions, duplicate entries, or missing UTR references — finance teams waste hours manually hunting for the discrepancy. Savoneyy eliminates that entirely.

---

## How It Works — Step by Step

### Step 1 — Sign Up / Sign In

1. Open `http://localhost:3000/login`
2. Sign up or sign in using **Clerk** authentication
3. You will be redirected to the dashboard automatically

### Step 2 — Seed or Connect Data Sources

**In Demo Mode (no API keys needed):**
1. Open `http://localhost:3000/dashboard`
2. Click **"Seed Batch"** in the top-right of the workbench
3. The engine generates a synthetic batch of ~50 payment records across all three sources with intentional mismatches

**In Production:**
- Connect your Razorpay account via API key (pulled from settlement reports)
- Configure bank SFTP feed (credit advice XML)
- Set up ERP webhook (SAP B1, Tally, NetSuite, etc.)
- Navigate to `/dashboard/sources` to manage all connected feeds

### Step 3 — Run Reconciliation

1. Click **"Run Reconciliation"** (or configure auto-scheduling in Settings)
2. The deterministic 3-way matching engine activates:
   - Matches records on `TxnID`, `OrderID`, `Amount`, and `Bank UTR Reference`
   - Applies configurable tolerance thresholds (default ±0.5%)
   - Classifies each record as one of:
     - ✅ **Matched** — all three sources agree exactly
     - ⚠️ **Matched with Variance** — within tolerance band, flagged for review
     - ❌ **Exception** — significant mismatch or missing data, requires investigation

### Step 4 — Gemini AI Exception Triage

For every **Exception** record, Google Gemini AI automatically:
- Reads the raw values from all three sources
- Identifies the nature of the mismatch (fee deduction, duplicate entry, missing UTR, etc.)
- Generates a **plain-English audit diagnosis** that your finance team can act on immediately

Example AI output:
> *"Bank credit received 2 days after gateway settlement date. UTR reference HDFC2024011501 confirms amount matches but timing discrepancy suggests delayed NEFT batch. Recommend: mark as timing exception, no refund required."*

### Step 5 — Review the Audit Workbench

The main dashboard (`/dashboard`) shows:
- **Metric cards** — Total records, match rate, variance count, open exceptions
- **Discrepancy Matrix** — A grid view of amount differences across sources
- **Audit Trail table** — Every record with its classification, confidence score, and AI diagnosis
- Click any row to open the **full Audit Worksheet modal** with side-by-side source comparison

### Step 6 — Subscribe via Razorpay

Navigate to `/dashboard/billing` to choose a plan:

| Plan | Price | Records/Batch |
|---|---|---|
| Starter | ₹999/mo | 5,000 |
| Pro | ₹2,999/mo | 50,000 |
| Enterprise | ₹9,999/mo | Unlimited |

Payment flows through **Razorpay Checkout** (live or simulation mode if keys not configured).

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL via Prisma ORM |
| **Authentication** | Clerk |
| **AI** | Google Gemini AI (via `@google/generative-ai`) |
| **Payments** | Razorpay Node.js SDK + Checkout.js |
| **Styling** | Tailwind CSS v4 — flat enterprise light mode |
| **Icons** | Lucide React |
| **Font** | Inter (Google Fonts) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with Clerk + Inter font
│   ├── globals.css                   # Global styles + badge tokens
│   ├── page.tsx                      # Marketing landing page
│   ├── login/page.tsx                # Clerk sign-in page
│   │
│   ├── dashboard/
│   │   ├── layout.tsx                # Sidebar + mobile drawer wrapper
│   │   ├── page.tsx                  # Reconciliation Workbench
│   │   ├── history/page.tsx          # Batch run log & analytics
│   │   ├── sources/page.tsx          # Data feed connector manager
│   │   ├── billing/page.tsx          # Razorpay plan checkout
│   │   └── settings/page.tsx         # Engine rules & AI config
│   │
│   └── api/
│       ├── seed/route.ts             # POST — seed synthetic batch data
│       ├── reconciliation/
│       │   ├── run/route.ts          # POST — trigger batch run
│       │   └── latest/route.ts       # GET — fetch latest results
│       ├── engine/settings/route.ts  # GET/PUT — engine configuration
│       └── razorpay/
│           ├── create-order/route.ts   # POST — create Razorpay subscription
│           ├── verify-payment/route.ts # POST — verify HMAC signature
│           ├── subscription/route.ts   # GET — current user subscription
│           └── webhook/route.ts        # POST — Razorpay webhook handler
│
├── components/
│   ├── Sidebar.tsx                   # Desktop persistent navigation
│   ├── MobileDrawer.tsx              # Mobile slide-over with X close button
│   ├── Footer.tsx                    # Dashboard footer
│   ├── Navbar.tsx                    # Legacy top nav (dashboard)
│   ├── MetricCards.tsx               # KPI summary cards
│   ├── DiscrepancyMatrixCard.tsx     # 3-source heatmap grid
│   └── AuditDetailModal.tsx          # Record detail worksheet modal
│
└── lib/
    ├── razorpay.ts                   # SDK init, subscription creation, HMAC verify
    ├── prisma.ts                     # Prisma client singleton
    └── data-generator.ts             # Synthetic dataset generation
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL database (Neon, Supabase, or local)

### 1. Clone and Install

```bash
git clone <repo-url>
cd razorpay
npm install
```

### 2. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database (PostgreSQL connection string)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# Google Gemini AI (get from https://aistudio.google.com)
GEMINI_API_KEY="your-gemini-api-key"

# Clerk Authentication (get from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Razorpay (get from https://dashboard.razorpay.com)
# Leave as demo values to use Simulation Mode — no real charges
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_demo"
RAZORPAY_KEY_ID="rzp_test_demo"
RAZORPAY_KEY_SECRET="demo_secret"

# Razorpay Subscription Plan IDs (create these in Razorpay Dashboard)
RAZORPAY_STARTER_PLAN_ID="plan_..."
RAZORPAY_PRO_PLAN_ID="plan_..."
RAZORPAY_ENTERPRISE_PLAN_ID="plan_..."

# Optional: Razorpay Webhook Secret (configure in Razorpay Dashboard)
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
```

> **Simulation Mode**: If `RAZORPAY_KEY_ID` contains "demo", the billing page runs in simulation mode — no real Razorpay charges are made.

### 3. Initialize Database

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Authentication & Backend

### Clerk Authentication

Savoneyy uses **Clerk** for authentication:

- **Login Page**: `/login` — Custom styled Clerk SignIn component
- **Protected Routes**: All `/dashboard/*` routes require authentication
- **Middleware**: `middleware.ts` protects dashboard and API routes
- **User Context**: All API routes use the authenticated Clerk `userId` for data isolation

### Backend API Routes

The backend is built with Next.js API Routes (App Router):

| Endpoint | Method | Description |
|---|---|---|
| `/api/seed` | POST | Seed synthetic reconciliation data |
| `/api/reconciliation/run` | POST | Trigger reconciliation batch run |
| `/api/reconciliation/latest` | GET | Fetch latest reconciliation results |
| `/api/engine/settings` | GET/PUT | Read/update engine configuration |
| `/api/razorpay/create-order` | POST | Create Razorpay subscription |
| `/api/razorpay/verify-payment` | POST | Verify Razorpay payment signature |
| `/api/razorpay/subscription` | GET | Get current user subscription |
| `/api/razorpay/webhook` | POST | Handle Razorpay webhook events |

All sensitive routes require authentication via Clerk. The `userId` from Clerk is used to isolate user data in the database.

---

## Usage Walkthrough

1. **Landing page** → `http://localhost:3000`  
   See the product overview, features, pipeline, and pricing.

2. **Login** → `http://localhost:3000/login`  
   Sign in with Clerk.

3. **Dashboard** → `http://localhost:3000/dashboard`  
   Click **"Seed Batch"** then **"Run Reconciliation"** to process a synthetic batch.

4. **Audit Table** → Click any row to open the full audit worksheet with Gemini AI diagnosis.

5. **Batch History** → `/dashboard/history`  
   View all previous runs with duration, match rate, and outcome counts.

6. **Data Sources** → `/dashboard/sources`  
   View connected feed status (Gateway / Bank / ERP) with sync controls.

7. **Billing** → `/dashboard/billing`  
   Choose a plan and complete payment via Razorpay Checkout.

8. **Settings** → `/dashboard/settings`  
   Tune tolerance thresholds, Gemini AI reasoning, scheduling, notifications, and webhooks.

---

## Key Design Decisions

- **Deterministic first, AI second**: The core matching engine is fully rule-based and auditable. Gemini AI is only invoked for exception *explanation* — not for matching decisions. This ensures reproducible results.

- **Simulation Mode**: The entire Razorpay billing flow works without live API keys, making it easy to demo without a test account.

- **Flat enterprise UI**: Deliberately avoids gradients, glassmorphism, and decorative effects. The aesthetic is Bloomberg Terminal / Retool — maximum data density, zero noise.

- **PostgreSQL for production**: Uses PostgreSQL via Prisma ORM for production-grade data integrity and scalability.

- **Clerk for Auth**: Enterprise-grade authentication with support for SSO, MFA, and user management out of the box.

---

## Commit Convention

This project follows conventional commits:

```
feat: add new feature
fix: bug fix
chore: config/tooling changes
docs: documentation update
```

---

## License

MIT — Built for the Razorpay AI Buildathon by **Priya**.
