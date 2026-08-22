# Project: Savoneyy — AI Finance Controller (Razorpay Buildathon, Track 4)

## What this is for
Razorpay AI Buildathon submission. Track 4 requires an agent that closes **one finance-ops loop** over a 50+ record batch of synthetic data, and reports **match rate + an honest exception list**. Judged on throughput, measured accuracy, and honesty about what it *couldn't* resolve — not a cherry-picked demo.

## Chosen direction: Multi-source Reconciliation Agent
Reconciles transactions across 3 synthetic sources that should agree but don't perfectly:
1. **Payment Gateway Settlement file** (like Razorpay settlement report — txn_id, amount, fee, settled_amount, utr)
2. **Bank Statement** (utr, credited_amount, date — sometimes batched/delayed)
3. **Internal Ledger** (order_id, expected_amount, txn_id — the merchant's own books)

Agent matches records across all three, flags mismatches (amount drift, missing UTR, duplicate settlement, timing gaps), and produces a reconciliation report with an audit trail.

**Why this direction over the others:** it's the most self-contained (no need for live APIs), it's a clean supervised-matching problem with clear precision/recall metrics, and it reuses your existing Prisma + Postgres + Node backend skills from Savoney/Clip-Crafter rather than starting a new domain from zero.

## Stack (reusing what you already know)
- **Backend/agent logic**: Node.js + TypeScript
- **DB**: PostgreSQL (Neon) + Prisma ORM
- **LLM**: Gemini — used only for the *exception reasoning* step (explaining *why* a record didn't match, in plain English), not for the core matching (that should be deterministic/rule-based + fuzzy matching, so it's auditable)
- **Frontend**: Next.js + Tailwind — a single dashboard page, not a full app
- **Data gen**: a seed script that generates synthetic records with deliberate, labeled discrepancies (so you can compute real precision/recall against ground truth)

Skip Clerk/auth entirely — not needed for a judged demo, saves time.

---

## Build plan

### Phase 0 — Setup (30–45 min)
- [ ] `npx create-next-app` with TypeScript + Tailwind
- [ ] Init Prisma, connect to a fresh Neon Postgres instance
- [ ] Repo must be **public** from the start (submission requirement)
- [ ] Write the README skeleton now (fill in as you go) — judges read this first

### Phase 1 — Data model (30 min)
- [ ] Prisma schema: `GatewaySettlement`, `BankStatement`, `LedgerEntry`, and a `GroundTruthLabel` table (used only for scoring, not by the agent)
- [ ] Each synthetic record gets a `record_id` and a hidden `discrepancy_type` field (null | "amount_mismatch" | "missing_utr" | "duplicate" | "timing_gap" | "unmatched")

### Phase 2 — Synthetic data generator (45–60 min)
- [ ] Script to generate 50–100 correlated records across the 3 sources
- [ ] Inject controlled discrepancies at a known rate (e.g. 70% clean matches, 30% across the 4 discrepancy types above) — this labeled set is what makes your accuracy numbers real, not vibes
- [ ] Seed the DB

### Phase 3 — Matching engine (core — 2–3 hrs)
- [ ] Exact-match pass: txn_id/UTR/order_id joins across sources
- [ ] Fuzzy pass for the rest: amount within tolerance + date window + partial ID match
- [ ] Classify every record into: `matched`, `matched_with_variance`, or `exception`
- [ ] This layer must be deterministic and explainable — no LLM here. Judges specifically reward "every action explainable, bounded" style rigor even outside Track 1.

### Phase 4 — Exception reasoning (Gemini) (1 hr)
- [ ] For every record landing in `exception`, call Gemini with the 3 candidate records + rule-engine notes → get a 1-line plain-English reason ("Bank credited ₹998, gateway settled ₹1000 — likely fee misapplied")
- [ ] Cap this to exceptions only (keeps it cheap, keeps the deterministic core auditable)

### Phase 5 — Scoring against ground truth (30 min)
- [ ] Compare agent output to `GroundTruthLabel`
- [ ] Compute: match rate, precision, recall, false-positive rate
- [ ] This is the single most important number in your pitch — get it real, don't fudge it

### Phase 6 — Audit trail (30–45 min)
- [ ] Every match/exception decision logged with: input records, rule/score that fired, timestamp
- [ ] Store as a queryable table, not just console logs — you need to show this live

### Phase 7 — Dashboard (1.5–2 hrs)
- [ ] Single page: upload/run batch → table of results (matched / variance / exception) → summary metrics card (match rate, precision, recall) → click a row to see the audit trail + Gemini's exception reasoning
- [ ] Keep it plain — function over polish, you have limited time

### Phase 8 — Submission assets (1–1.5 hrs)
- [ ] Public GitHub repo, clean README: problem, approach, architecture, how to run, metrics achieved
- [ ] Architecture diagram (source → matching engine → exception reasoner → audit log → dashboard)
- [ ] 5-minute pitch video: problem (30s) → live demo running a batch (2.5 min) → metrics + one failure case handled honestly (1 min) → architecture walkthrough (1 min)

---

## The bar you're being judged against (don't skip this)
> "Throughput plus measured accuracy plus an honest exception list. One cherry-picked match proves nothing."

Concretely: don't demo only the clean matches. Show at least one exception the agent correctly flagged as unresolved, and say so out loud in the pitch. That honesty is explicitly what they're screening for.

## Timeline note
Phases 3, 4, 7 are the time sinks. If you're short on time, cut dashboard polish before you cut the ground-truth scoring — the metrics are the actual submission requirement, the UI is just how you show them.