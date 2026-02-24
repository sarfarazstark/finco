import Link from 'next/link';
import { formatCurrency, formatTransactionDate } from '@/lib/utils';
import type { TransactionWithRelations } from '@/components/transactions/resolved-image';
import Image from 'next/image';

export function OverviewTransactionsWidget({
	transactions,
	currency,
}: {
	transactions: TransactionWithRelations[];
	currency: string;
}) {
	const recentTxs = transactions.slice(0, 5);

	return (
		<div className="bg-white rounded-xl p-8">
			<div className="flex items-center justify-between mb-8 flex-wrap gap-4">
				<h2 className="font-preset-2 text-grey-900">Transactions</h2>
				<Link
					href="/transactions"
					className="font-preset-4 text-grey-500 hover:text-grey-900 transition-colors flex items-center gap-3"
				>
					View All
					<i className="ti ti-chevron-right text-xs" />
				</Link>
			</div>

			<div className="flex flex-col">
				{recentTxs.map((tx, i) => {
					const isPositive =
						tx.type === 'INCOME' ||
						(tx.amount >= 0 && tx.type !== 'EXPENSE');
					const sign = isPositive ? '+' : '-';

					return (
						<div
							key={tx.id}
							className={`flex items-center justify-between py-5 ${i !== recentTxs.length - 1 ? 'border-b border-grey-100/50' : 'pt-5 pb-1'}`}
						>
							<div className="flex items-center gap-4">
								<i
									className={`ti ti-${tx.category?.icon.name} text-2xl text-white p-2 rounded-full ${tx.category?.icon.color}`}
								></i>
								<p className="font-preset-4 font-semibold text-grey-900">
									{tx.name}
								</p>
							</div>

							<div className="text-right">
								<p
									className={`font-preset-4 font-semibold mb-1 ${isPositive ? 'text-green' : 'text-grey-900'}`}
								>
									{sign}
									{formatCurrency(
										Math.abs(tx.amount),
										currency
									)}
								</p>
								<p className="font-preset-5 text-grey-500">
									{formatTransactionDate(tx.date)}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
