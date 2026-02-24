import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import type { RecurringTransactionWithRelations } from '../recurring-bills/_components/bill-row';
import type { BillStatus } from '../recurring-bills/_components/bill-row';

export function OverviewRecurringBillsWidget({
	bills,
	statusMap,
	currency,
}: {
	bills: RecurringTransactionWithRelations[];
	statusMap: Record<string, BillStatus>;
	currency: string;
}) {
	let paidAmount = 0;
	let upcomingAmount = 0;
	let dueSoonAmount = 0;

	for (const bill of bills) {
		const status = statusMap[bill.id] || 'upcoming';
		const amount = Math.abs(bill.amount);

		switch (status) {
			case 'paid':
				paidAmount += amount;
				break;
			case 'due-soon':
				dueSoonAmount += amount;
				break;
			default:
				upcomingAmount += amount;
		}
	}

	return (
		<div className="bg-white rounded-xl p-8">
			<div className="flex items-center justify-between mb-5">
				<h2 className="font-preset-2 text-grey-900">Recurring Bills</h2>
				<Link
					href="/recurring-bills"
					className="font-preset-4 text-grey-500 hover:text-grey-900 transition-colors flex items-center gap-3"
				>
					See Details
					<i className="ti ti-chevron-right text-xs" />
				</Link>
			</div>

			<div className="flex flex-col gap-3">
				{/* Paid Bills */}
				<div className="bg-beige-100 rounded-lg p-5 flex items-center justify-between border-l-4 border-green">
					<p className="font-preset-4 text-grey-500">Paid Bills</p>
					<p className="font-preset-4-bold text-grey-900">
						{formatCurrency(paidAmount, currency)}
					</p>
				</div>

				{/* Total Upcoming */}
				<div className="bg-beige-100 rounded-lg p-5 flex items-center justify-between border-l-4 border-yellow-500">
					<p className="font-preset-4 text-grey-500">
						Total Upcoming
					</p>
					<p className="font-preset-4-bold text-grey-900">
						{formatCurrency(upcomingAmount, currency)}
					</p>
				</div>

				{/* Due Soon */}
				<div className="bg-beige-100 rounded-lg p-5 flex items-center justify-between border-l-4 border-cyan-500">
					<p className="font-preset-4 text-grey-500">Due Soon</p>
					<p className="font-preset-4-bold text-grey-900">
						{formatCurrency(dueSoonAmount, currency)}
					</p>
				</div>
			</div>
		</div>
	);
}
