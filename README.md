# Savoneyy — AI Finance Controller (Razorpay AI Buildathon Track 4)

> **Autonomous Multi-Source Financial Reconciliation Engine & Audit Dashboard**

Savoneyy is an AI-powered financial reconciliation agent built for **Track 4 of the Razorpay AI Buildathon**. It closes the finance-ops loop across three disjointed financial sources, measures match rates against labeled ground truth, logs an auditable decision trail, and uses Gemini AI to explain unresolvable exceptions in plain English.

---

## 🎯 Problem Statement
Finance ops teams spend hours manually matching records across:
1. **Payment Gateway Settlements** (e.g., Razorpay settlement reports containing `txn_id`, `amount`, `fee`, `settled_amount`, `utr`)
2. **Bank Statements** (containing `utr`, `credited_amount`, `date`)
3. **Internal Ledger** (the merchant's ERP/order system containing `order_id`, `expected_amount`, `txn_id`)

Discrepancies such as missing UTRs, fee variances, duplicate settlements, and timing gaps cause reconciliation delays and accounting errors.

---

## 💡 Solution Overview
Savoneyy solves this through a **hybrid deterministic + generative AI architecture**:
- **Deterministic Multi-Pass Engine**: Executes exact joins and rule-based fuzzy/variance matching across all 3 sources (100% explainable, 0 hallucination risk for money matching).
- **Ground-Truth Accuracy Scoring**: Measures Match Rate, Precision, Recall, and False Positive Rate against synthetic datasets with injected, labeled discrepancies.
- **Gemini Exception Reasoning**: Calls Google Gemini AI strictly on `exception` records to provide plain-English root-cause diagnoses.
- **Queryable Audit Trail**: Stores full decision trace for every record.
- **Interactive Dashboard**: Single-page Next.js dashboard featuring live batch execution, metric cards, filtering, and side-by-side reconciliation drawers.

---

## 🏗️ Architecture

```
+---------------------+    +-----------------+    +-----------------+
|  Gateway Settlement |    |  Bank Statement |    | Internal Ledger |
+----------+----------+    +--------+--------+    +--------+--------+
           |                        |                      |
           +------------------------+----------------------+
                                    |
                                    v
                     +------------------------------+
                     |  Multi-Pass Matching Engine  |
                     |  (Exact Joins & Fuzzy Rules) |
                     +--------------+---------------+
                                    |
            +-----------------------+-----------------------+
            |                       |                       |
            v                       v                       v
      [  Matched  ]       [ Matched w/ Variance ]     [  Exception  ]
            |                       |                       |
            |                       +-----------+-----------+
            |                                   |
            |                                   v
            |                      +------------------------+
            |                      |   Gemini AI Reasoner   |
            |                      | (Root Cause Diagnosis) |
            |                      +------------+-----------+
            |                                   |
            +-----------------------+-----------+
                                    |
                                    v
                     +------------------------------+
                     |   Audit Trail & Evaluator    |
                     | (Precision / Recall Metrics) |
                     +--------------+---------------+
                                    |
                                    v
                     +------------------------------+
                     |   Next.js Audit Dashboard    |
                     +------------------------------+
```

---

## 🚀 Tech Stack
- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database & ORM**: PostgreSQL / SQLite + Prisma ORM
- **AI Reasoning**: Google Gemini API (`@google/genai`)
- **Icons**: Lucide React

---

## 🛠️ Quick Start & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Provide your `DATABASE_URL` and optionally `GEMINI_API_KEY`.

3. **Database Migration & Seeding**:
   ```bash
   npx prisma db push
   npm run seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Benchmarks & Ground-Truth Accuracy
*Will be updated after running the synthetic evaluation suite.*

---

## 📜 License
MIT
