import type { Budget, Category, Icon, Theme } from '@prisma/client';
import type { TransactionWithRelations } from '@/components/transactions/resolved-image';

export type BudgetWithTheme = Budget & { theme: Theme | null };

export interface FormattedBudgetCategory extends Category {
	icon: Icon;
	budgets: BudgetWithTheme[];
	transactions: TransactionWithRelations[];
	spent: number;
	startDate: Date;
}
