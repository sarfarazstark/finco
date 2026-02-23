-- CreateEnum
CREATE TYPE "BudgetType" AS ENUM ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "type" "BudgetType" NOT NULL DEFAULT 'MONTHLY';
