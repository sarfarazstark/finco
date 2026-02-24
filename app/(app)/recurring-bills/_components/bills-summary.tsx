import { formatCurrency } from '@/lib/utils';

interface BillsSummaryProps {
	totalAmount: number;
	paidCount: number;
	paidAmount: number;
	upcomingCount: number;
	upcomingAmount: number;
	dueSoonCount: number;
	dueSoonAmount: number;
	currency: string;
}

export function BillsSummary({
	totalAmount,
	paidCount,
	paidAmount,
	upcomingCount,
	upcomingAmount,
	dueSoonCount,
	dueSoonAmount,
	currency,
}: BillsSummaryProps) {
	return (
		<div className="flex flex-col gap-6 w-80 shrink-0">
			<div className="bg-grey-900 text-white rounded-xl p-8">
				<div className="mb-6">
					<i className="ti ti-receipt text-3xl opacity-70"></i>
				</div>
				<p className="font-preset-4 text-grey-300">Total Bills</p>
				<p className="font-preset-1 font-bold mt-2">
					{formatCurrency(totalAmount, currency)}
				</p>
			</div>

			<div className="bg-white rounded-xl p-6">
				<h3 className="font-preset-3 font-bold mb-5">Summary</h3>

				<div className="flex flex-col gap-4">
					<div className="flex justify-between items-center pb-4 border-b border-grey-100">
						<p className="font-preset-4 text-grey-500">Paid Bills</p>
						<p className="font-preset-4-bold text-grey-900">
							{paidCount} ({formatCurrency(paidAmount, currency)})
						</p>
					</div>

					<div className="flex justify-between items-center pb-4 border-b border-grey-100">
						<p className="font-preset-4 text-grey-500">
							Total Upcoming
						</p>
						<p className="font-preset-4-bold text-grey-900">
							{upcomingCount} ({formatCurrency(upcomingAmount, currency)})
						</p>
					</div>

					<div className="flex justify-between items-center">
						<p className="font-preset-4 text-red">Due Soon</p>
						<p className="font-preset-4-bold text-red">
							{dueSoonCount} ({formatCurrency(dueSoonAmount, currency)})
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
