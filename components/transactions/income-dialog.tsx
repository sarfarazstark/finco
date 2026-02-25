'use client';

import { Category } from './category-dialog';
import { AccountSelectorProps } from '../layout/global-add-button';
import { BaseTransactionDialog } from './base-transaction-dialog';
import { Setting, Icon } from '@prisma/client';

export function IncomeDialog({
	open,
	onOpenChange,
	categories,
	accounts,
	settings,
	dbIcons,
	transactionId,
	initialData,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categories: Category[];
	accounts: AccountSelectorProps[];
	settings: Setting;
	dbIcons: Icon[];
	transactionId?: string;
	initialData?: {
		amount: number;
		name: string;
		accountId: string;
		categoryId?: string | null;
		date: Date;
		recurring?: boolean;
	};
}) {
	return (
		<BaseTransactionDialog
			type="INCOME"
			open={open}
			onOpenChange={onOpenChange}
			categories={categories}
			accounts={accounts}
			settings={settings}
			dbIcons={dbIcons}
			transactionId={transactionId}
			initialData={initialData}
		/>
	);
}
