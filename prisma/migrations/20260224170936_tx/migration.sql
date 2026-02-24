-- AlterTable
ALTER TABLE "Pot" ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "frequency" INTEGER;
