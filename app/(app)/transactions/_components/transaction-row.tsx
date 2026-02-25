import { ResolvedImage, TransactionWithRelations } from '@/components/transactions/resolved-image';
import { TransactionActions } from './transaction-actions';
import { Category } from '@/components/transactions/category-dialog';
import { AccountSelectorProps } from '@/components/layout/global-add-button';
import { formatTransactionDate } from '@/lib/utils';
import { AccountAvatar } from '@/components/transactions/account-avatar';
import { Setting } from '@prisma/client';
import { IconCalendarRepeat } from '@tabler/icons-react';



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
		<tr className="text-left font-preset-5 text-grey-500 border-b border-grey-100/50 last:border-b-0 transition-colors hover:bg-grey-50/30">
			<td className="px-5 py-5">
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
			<td className="px-5 py-5">{categoryName}</td>
			<td className="px-5 py-5">
				<span className="flex items-center gap-2">
					{formatTransactionDate(transaction.date)}{' '}
					{transaction.recurring && (
						<IconCalendarRepeat
							size={16}
							className={
								transaction.type === 'INCOME'
									? 'text-green'
									: 'text-red/60'
							}
						/>
					)}
				</span>
			</td>
			<td
				className={`px-5 py-5 text-right font-preset-4-bold ${
					isPositive ? 'text-green' : 'text-grey-900'
				}`}
			>
				{sign}₹{Math.abs(transaction.amount).toFixed(2)}
			</td>
			<td className="px-5 py-5 flex justify-end">
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
