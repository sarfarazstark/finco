import { ResolvedImage } from '@/components/transactions/resolved-image';
import { TransactionActions } from './transaction-actions';
import { Category } from '@/components/transactions/category-dialog';
import { AccountSelectorProps } from '@/components/layout/global-add-button';
import { formatTransactionDate } from '@/lib/utils';
import { AccountAvatar } from '@/components/transactions/account-avatar';

import { Transaction } from '@prisma/client';

export interface TransactionWithRelations extends Transaction {
	category: {
		name: string;
		icon: { name: string; id: string; color: string; bg: string };
	} | null;
	account: {
		name: string;
		id: string;
		userId: string;
		createdAt: Date;
		updatedAt: Date;
		image: string;
		currency: string;
	} | null;
}

export function TransactionRow({
	transaction,
	categories,
	accounts,
	settings,
}: {
	transaction: TransactionWithRelations;
	categories: Category[];
	accounts: AccountSelectorProps[];
	settings: { currency: string; theme: string };
}) {
	const isPositive = transaction.type === 'INCOME';
	const sign = isPositive ? '+' : '-';
	const categoryName = transaction.category?.name ?? 'General';

	return (
		<tr className="text-left font-preset-5 text-grey-500 border-b border-grey-100/50 last:border-b-0">
			<td className="px-3 py-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full flex align-center justify-center overflow-hidden shrink-0 border border-grey-100">
						<ResolvedImage transaction={transaction} />
					</div>
					<div className="flex flex-col">
						<p className="font-preset-4-bold text-sm text-grey-900 leading-tight">
							{transaction.name}
						</p>
						<p className="font-preset-5 text-xs text-grey-500 flex items-center gap-1.5 mt-0.5">
							<AccountAvatar
								url={transaction.account?.image}
								name={transaction.account?.name || 'Account'}
								className="w-3.5 h-3.5"
							/>
						</p>
					</div>
				</div>
			</td>
			<td className="px-3 py-4">{categoryName}</td>
			<td className="px-3 py-4">
				{formatTransactionDate(transaction.date)}
			</td>
			<td
				className={`px-3 py-4 text-right font-preset-4-bold ${
					isPositive ? 'text-green' : 'text-grey-900'
				}`}
			>
				{sign}₹{Math.abs(transaction.amount).toFixed(2)}
			</td>
			<td className="px-3 py-4 flex justify-end">
				<TransactionActions
					transaction={transaction}
					categories={categories}
					accounts={accounts}
					settings={settings}
				/>
			</td>
		</tr>
	);
}
