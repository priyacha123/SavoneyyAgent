-- CreateTable
CREATE TABLE "GatewaySettlement" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "txnId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "settledAmount" DOUBLE PRECISION NOT NULL,
    "utr" TEXT,
    "settlementDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GatewaySettlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankStatement" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,
    "utr" TEXT,
    "creditedAmount" DOUBLE PRECISION NOT NULL,
    "valueDate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "txnId" TEXT,
    "expectedAmount" DOUBLE PRECISION NOT NULL,
    "orderDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroundTruthLabel" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "txnId" TEXT,
    "orderId" TEXT,
    "utr" TEXT,
    "expectedStatus" TEXT NOT NULL,
    "discrepancyType" TEXT,
    "varianceAmount" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroundTruthLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReconciliationLog" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "txnId" TEXT,
    "orderId" TEXT,
    "utr" TEXT,
    "status" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "rulesFired" TEXT NOT NULL,
    "candidateRecords" TEXT NOT NULL,
    "geminiReasoning" TEXT,
    "groundTruthStatus" TEXT,
    "isCorrect" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReconciliationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReconciliationMetrics" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "totalRecords" INTEGER NOT NULL,
    "matchedCount" INTEGER NOT NULL,
    "varianceCount" INTEGER NOT NULL,
    "exceptionCount" INTEGER NOT NULL,
    "matchRate" DOUBLE PRECISION NOT NULL,
    "precision" DOUBLE PRECISION NOT NULL,
    "recall" DOUBLE PRECISION NOT NULL,
    "falsePositiveRate" DOUBLE PRECISION NOT NULL,
    "f1Score" DOUBLE PRECISION NOT NULL,
    "discrepancyMatrix" TEXT NOT NULL,
    "runTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReconciliationMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'usr_default',
    "planId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "razorpaySubscriptionId" TEXT,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngineSettings" (
    "id" TEXT NOT NULL DEFAULT 'default_settings',
    "amountTolerance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "dateToleranceDays" INTEGER NOT NULL DEFAULT 3,
    "enableGeminiAI" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EngineSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GatewaySettlement_recordId_key" ON "GatewaySettlement"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_recordId_key" ON "LedgerEntry"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "GroundTruthLabel_recordId_key" ON "GroundTruthLabel"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "ReconciliationMetrics_batchId_key" ON "ReconciliationMetrics"("batchId");
