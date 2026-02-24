import { formatCurrency } from '@/lib/utils';

export function OverviewSummaryCards({
	balance,
	income,
	expenses,
	currency,
}: {
	balance: number;
	income: number;
	expenses: number;
	currency: string;
}) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
			<div className="bg-grey-900 text-white rounded-xl p-6 relative overflow-hidden">
				<p className="font-preset-4 text-grey-100 mb-3 relative z-10">
					Current Balance
				</p>
				<p className="font-preset-1 font-semibold relative z-10">
					{formatCurrency(balance, currency)}
				</p>
			</div>

			<div className="bg-white rounded-xl p-6">
				<p className="font-preset-4 text-grey-500 mb-3">Income</p>
				<p className="font-preset-1 font-semibold text-grey-900">
					{formatCurrency(income, currency)}
				</p>
			</div>

			<div className="bg-white rounded-xl p-6">
				<p className="font-preset-4 text-grey-500 mb-3">Expenses</p>
				<p className="font-preset-1 font-semibold text-grey-900">
					{formatCurrency(expenses, currency)}
				</p>
			</div>
		</div>
	);
}
