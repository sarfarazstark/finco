import { ResolvedImage, TransactionWithRelations } from '@/components/transactions/resolved-image';
import { TransactionActions } from './transaction-actions';
import { Category } from '@/components/transactions/category-dialog';
import { AccountSelectorProps } from '@/components/layout/global-add-button';
import { formatTransactionDate } from '@/lib/utils';
import { AccountAvatar } from '@/components/transactions/account-avatar';
import { Setting } from '@prisma/client';

function getFrequencyLabel(frequency: number | null): string {
	if (!frequency) return '–';
	if (frequency <= 7) return 'Weekly';
	if (frequency <= 30) return 'Monthly';
	if (frequency <= 90) return 'Quarterly';
	return 'Yearly';
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
	settings: Setting;
}) {
	const isPositive = transaction.type === 'INCOME';
	const sign = isPositive ? '+' : '-';
	const categoryName = transaction.category?.name ?? 'General';

	return (
		<tr className="text-left font-preset-5 text-grey-500 border-b border-grey-100/50 last:border-b-0">
			<td className="px-3 py-4">
				<div className="flex items-center gap-4">
					<ResolvedImage transaction={transaction} />
					<div className="flex flex-col">
						<p className="font-preset-4-bold text-sm text-grey-900 leading-tight">
							{transaction.name}
						</p>
						<AccountAvatar
							url={transaction.account?.image}
							name={transaction.account?.name || 'Account'}
							className="w-3.5 h-3.5"
						/>
					</div>
				</div>
			</td>
			<td className="px-3 py-4">{categoryName}</td>
			<td className="px-3 py-4">
				{formatTransactionDate(transaction.date)}
			</td>
			<td className="px-3 py-4 font-preset-5 text-grey-500">
				{transaction.recurring
					? getFrequencyLabel(transaction.frequency)
					: '–'}
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
