import { formatCurrency, formatTransactionDate } from '@/lib/utils';
import { BudgetActions } from './budget-actions';
import { BudgetProgressBar } from './budget-progress-bar';
import { BudgetTransactionList } from './budget-transaction-list';
import type { CategoryWithIcon } from './budget-dialog';
import type { FormattedBudgetCategory } from './types';
import type { Theme } from '@prisma/client';

interface BudgetCardProps {
	budget: FormattedBudgetCategory;
	currency: string;
	categories: CategoryWithIcon[];
	themes: Theme[];
}

export function BudgetCard({
	budget,
	currency,
	categories,
	themes,
}: BudgetCardProps) {
	const themeColor = budget.budgets[0]?.theme?.hex || '#cccccc';
	const maximum = budget.budgets[0]?.maximum || 0;

	return (
		<div className="w-full bg-white rounded-xl p-8">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<div
						className="w-4 h-4 rounded-full"
						style={{ background: themeColor }}
					></div>
					<h2 className="font-preset-3 font-semibold">
						{budget.name}
					</h2>
				</div>
				<BudgetActions
					category={{
						id: budget.id,
						name: budget.name,
						budgets: budget.budgets.map(b => ({
							...b,
							theme: b.theme ?? undefined,
						})),
						icon: budget.icon,
					}}
					categories={categories}
					themes={themes}
				/>
			</div>

			<div className="mb-6">
				<p className="font-preset-5 mb-4 text-grey-500">
					Maximum of {formatCurrency(maximum, currency)}
				</p>
				<BudgetProgressBar
					spent={budget.spent}
					maximum={maximum}
					themeColor={themeColor}
					budgetId={budget.id}
				/>
			</div>

			<div className="flex mb-8 mt-6">
				<div className="flex w-1/2 items-start gap-4">
					<div
						className="w-1 h-11 rounded-full"
						style={{ background: themeColor }}
					></div>
					<div className="flex flex-col">
						<p className="font-preset-5 mb-1 text-grey-500">
							Spent{' '}
							<span className="text-xs tracking-tight">
								({formatTransactionDate(budget.startDate)})
							</span>
						</p>
						<p className="font-preset-5-bold text-grey-900">
							{formatCurrency(Math.abs(budget.spent), currency)}
						</p>
					</div>
				</div>

				<div className="flex w-1/2 items-start gap-4">
					<div className="w-1 h-11 rounded-full bg-[#F8F4F0]"></div>
					<div className="flex flex-col">
						<p className="font-preset-5 mb-1 text-grey-500">
							Remaining
						</p>
						<p className="font-preset-5-bold text-grey-900">
							{formatCurrency(
								Math.abs(maximum) - Math.abs(budget.spent),
								currency
							)}
						</p>
					</div>
				</div>
			</div>

			<BudgetTransactionList
				transactions={budget.transactions}
				budgetName={budget.name}
				currency={currency}
			/>
		</div>
	);
}
