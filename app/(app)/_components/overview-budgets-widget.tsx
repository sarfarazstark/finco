import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import type { Budget, Category, Transaction, Theme } from '@prisma/client';
import DonutChart, { type ChartData } from '@/components/charts/pie';

type BudgetWithRelations = Budget & {
	category: Category;
	theme: Theme;
};

export function OverviewBudgetsWidget({
	budgets,
	transactions,
	currency,
}: {
	budgets: BudgetWithRelations[];
	transactions: Transaction[];
	currency: string;
}) {
	const getStartDate = (period: string) => {
		const now = new Date();
		switch (period) {
			case 'WEEKLY':
				return new Date(now.setDate(now.getDate() - now.getDay()));
			case 'MONTHLY':
				return new Date(now.getFullYear(), now.getMonth(), 1);
			case 'QUARTERLY':
				return new Date(
					now.getFullYear(),
					Math.floor(now.getMonth() / 3) * 3,
					1
				);
			case 'YEARLY':
				return new Date(now.getFullYear(), 0, 1);
			default:
				return new Date(now.getFullYear(), now.getMonth(), 1);
		}
	};

	const budgetData: ChartData[] = budgets.map(budget => {
		const type = budget.type || 'MONTHLY';
		const startDate = getStartDate(type);

		const spent = transactions
			.filter(
				tx =>
					tx.categoryId === budget.categoryId &&
					new Date(tx.createdAt) >= startDate
			)
			.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

		return {
			name: budget.category.name,
			value: Math.abs(spent),
			limit: budget.maximum,
			color: budget.theme.hex,
		};
	});

	const totalSpent = budgetData.reduce((sum, b) => sum + b.value, 0);
	const chartData =
		totalSpent === 0 && budgetData.length === 0
			? [{ name: 'Empty', value: 0, limit: 1, color: '#F8F4F0' }]
			: budgetData;

	return (
		<div className="bg-white rounded-xl p-8 flex-1">
			<div className="flex items-center justify-between mb-5">
				<h2 className="font-preset-2 text-grey-900">Budgets</h2>
				<Link
					href="/budget"
					className="font-preset-4 text-grey-500 hover:text-grey-900 transition-colors flex items-center gap-3"
				>
					See Details
					<i className="ti ti-chevron-right text-xs" />
				</Link>
			</div>

			<div className="flex flex-col sm:flex-row gap-6 items-center">
				<div className="shrink-0 flex items-center justify-center">
					<DonutChart data={chartData} currency={currency} />
				</div>

				<div className="flex flex-col gap-4 flex-1 w-full mt-4 sm:mt-0">
					{budgetData.slice(0, 4).map(budget => (
						<div
							key={budget.name}
							className="flex flex-col items-start justify-between border-l-4 pl-4 py-1"
							style={{ borderColor: budget.color }}
						>
							<p className="font-preset-5 text-grey-500">
								{budget.name}
							</p>
							<p className="font-preset-4 font-semibold text-grey-900">
								{formatCurrency(budget.limit, currency)}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
