import type { Category, FinancialAccount, Transaction } from '@prisma/client';

export type TransactionWithRelations = Transaction & {
  category: Category | null;
  account: FinancialAccount | null;
};

/**
 * Deterministically resolves the transaction image.
 * Priority:
 * 1. Explicit override on the transaction (`avatar` in JSON)
 * 2. Category image (for standard expenses)
 * 3. Account image (for transfers/generic source)
 * 4. Fallback generic icon
 */
export function resolveTransactionImage(tx: TransactionWithRelations): string {
  return (
    tx.image ??
    tx.category?.image ??
    tx.account?.image ??
    '/assets/images/default-avatar.png'
  );
}
