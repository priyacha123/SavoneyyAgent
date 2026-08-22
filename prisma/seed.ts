import { PrismaClient } from "@prisma/client";
import { generateSyntheticDataset } from "../src/lib/data-generator";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Clearing existing reconciliation database tables...");
  await prisma.reconciliationLog.deleteMany({});
  await prisma.reconciliationMetrics.deleteMany({});
  await prisma.gatewaySettlement.deleteMany({});
  await prisma.bankStatement.deleteMany({});
  await prisma.ledgerEntry.deleteMany({});
  await prisma.groundTruthLabel.deleteMany({});
  await prisma.userSubscription.deleteMany({});

  console.log("🎲 Generating 60 synthetic records across Gateway, Bank, and Ledger with ground truth...");
  const dataset = generateSyntheticDataset(60);

  // Seed Gateway Settlements
  console.log(`Inserting ${dataset.gatewayRecords.length} Gateway Settlement records...`);
  for (const g of dataset.gatewayRecords) {
    await prisma.gatewaySettlement.create({
      data: g,
    });
  }

  // Seed Bank Statements
  console.log(`Inserting ${dataset.bankRecords.length} Bank Statement records...`);
  for (const b of dataset.bankRecords) {
    await prisma.bankStatement.create({
      data: b,
    });
  }

  // Seed Ledger Entries
  console.log(`Inserting ${dataset.ledgerRecords.length} Internal Ledger records...`);
  for (const l of dataset.ledgerRecords) {
    await prisma.ledgerEntry.create({
      data: l,
    });
  }

  // Seed Ground Truth Labels
  console.log(`Inserting ${dataset.groundTruth.length} Ground Truth Labels...`);
  for (const gt of dataset.groundTruth) {
    await prisma.groundTruthLabel.create({
      data: gt,
    });
  }

  console.log("✅ Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
