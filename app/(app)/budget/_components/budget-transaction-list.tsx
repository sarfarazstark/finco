import { IconChevronRight } from '@tabler/icons-react';
import { formatCurrency, formatTransactionDate } from '@/lib/utils';
import { ResolvedImage } from '@/components/transactions/resolved-image';
import type { TransactionWithRelations } from '@/components/transactions/resolved-image';
import Link from 'next/link';

interface BudgetTransactionListProps {
	transactions: TransactionWithRelations[];
	budgetName: string;
	currency: string;
}

export function BudgetTransactionList({
	transactions,
	budgetName,
	currency,
}: BudgetTransactionListProps) {
	return (
		<div className="bg-[#F8F4F0] rounded-xl p-5">
			<div className="flex justify-between items-center mb-5">
				<h3 className="font-preset-3 font-semibold">Latest Spending</h3>
				<Link
					href={`/transactions?category=${encodeURIComponent(budgetName)}`}
					className="flex items-center gap-2 text-[14px] text-grey-500 hover:text-[#202226] transition-colors"
				>
					See All
					<IconChevronRight />
				</Link>
			</div>

			<div className="flex flex-col">
				{transactions.map((tx, index) => (
					<div
						key={tx.id}
						className={`flex items-center justify-between py-3 ${index === transactions.length - 1 ? 'border-none' : 'border-b border-[#E0DEDC]'}`}
					>
						<div className="flex items-center gap-4">
							<ResolvedImage transaction={tx} />
							<span className="font-preset-5-bold">
								{tx.name}
							</span>
						</div>
						<div className="flex flex-col items-end">
							<span className="font-preset-5-bold mb-1">
								{formatCurrency(tx.amount, currency)}
							</span>
							<span className="font-preset-5">
								{formatTransactionDate(tx.date)}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
