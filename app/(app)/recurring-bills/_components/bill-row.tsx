import { formatCurrency } from '@/lib/utils';
import type {
	Transaction,
	Category,
	Icon,
	FinancialAccount,
} from '@prisma/client';
import { IconCircleCheckFilled, IconCircleXFilled } from '@tabler/icons-react';

export type BillStatus = 'paid' | 'due-soon' | 'upcoming';

export type RecurringTransactionWithRelations = Transaction & {
	category: (Category & { icon: Icon | null }) | null;
	account: FinancialAccount;
};

function getFrequencyLabel(frequency: number | null): string {
	if (!frequency) return 'Recurring';
	if (frequency <= 7) return 'Weekly';
	if (frequency <= 30) return 'Monthly';
	if (frequency <= 90) return 'Quarterly';
	return 'Yearly';
}

function getOrdinal(n: number): string {
	const s = ['th', 'st', 'nd', 'rd'];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function BillRow({
	bill,
	currency,
	status,
}: {
	bill: RecurringTransactionWithRelations;
	currency: string;
	status: BillStatus;
}) {
	const isExpense = bill.type === 'EXPENSE';
	const iconBg = bill.category?.icon?.color || 'bg-grey-300';
	const iconName = bill.category?.icon?.name || 'receipt';

	const frequencyLabel = getFrequencyLabel(bill.frequency);
	const dueDay = new Date(bill.date).getDate();
	const dueDateLabel = `${frequencyLabel} - ${getOrdinal(dueDay)}`;

	return (
		<tr className="border-b border-grey-100/50 last:border-b-0">
			<td className="py-4 pr-4">
				<div className="flex items-center gap-4">
					<div
						className={`w-10 h-10 rounded-full ${iconBg} text-white flex items-center justify-center shrink-0`}
					>
						<i className={`ti ti-${iconName} text-lg`} />
					</div>
					<p className="font-preset-4-bold text-grey-900">
						{bill.name}
					</p>
				</div>
			</td>
			<td className="py-4">
				<div className="flex items-center gap-2">
					<span className="font-preset-5 text-grey-500">
						{dueDateLabel}
					</span>
					{status === 'paid' && (
						<IconCircleCheckFilled className="w-4 h-4 shrink-0 text-green" />
					)}
					{status === 'due-soon' && (
						<IconCircleXFilled className="w-4 h-4 shrink-0 text-red" />
					)}
				</div>
			</td>
			<td className="py-4 text-right">
				<p
					className={`font-preset-4-bold ${
						status === 'due-soon' && isExpense
							? 'text-red'
							: isExpense
								? 'text-red'
								: 'text-grey-900'
					}`}
				>
					{formatCurrency(Math.abs(bill.amount), currency)}
				</p>
			</td>
		</tr>
	);
}
