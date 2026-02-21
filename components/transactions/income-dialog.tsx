'use client';

import { Category } from './category-dialog';
import { AccountSelectorProps } from '../layout/global-add-button';
import { BaseTransactionDialog } from './base-transaction-dialog';

export function IncomeDialog({
	open,
	onOpenChange,
	categories,
	accounts,
	settings,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categories: Category[];
	accounts: AccountSelectorProps[];
	settings?: { currency: string; theme: string };
}) {
	return (
		<BaseTransactionDialog
			type="INCOME"
			open={open}
			onOpenChange={onOpenChange}
			categories={categories}
			accounts={accounts}
			settings={settings}
		/>
	);
}
