import { formatCurrency } from '@/lib/utils';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

export function AccountSummaryCards({
	totalAssets,
	totalLiabilities,
	currency,
}: {
	totalAssets: number;
	totalLiabilities: number;
	currency: string;
}) {
	const netWorth = totalAssets - totalLiabilities;

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div className="bg-white rounded-2xl p-6 border border-grey-100 shadow-sm">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center">
						<IconTrendingUp className="w-6 h-6 text-green" />
					</div>
					<p className="text-sm font-medium text-grey-500">
						Total Assets
					</p>
				</div>
				<p className="text-3xl font-bold text-grey-900">
					{formatCurrency(totalAssets, currency)}
				</p>
			</div>

			<div className="bg-white rounded-2xl p-6 border border-grey-100 shadow-sm">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
						<IconTrendingDown className="w-6 h-6 text-red-500" />
					</div>
					<p className="text-sm font-medium text-grey-500">
						Total Liabilities
					</p>
				</div>
				<p className="text-3xl font-bold text-grey-900">
					{formatCurrency(totalLiabilities, currency)}
				</p>
			</div>

			<div className="bg-grey-900 rounded-2xl p-6 text-white shadow-sm ring-1 ring-grey-900/5 items-center flex flex-col justify-center relative overflow-hidden">
				<div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
					<IconTrendingUp className="w-24 h-24" />
				</div>
				<div className="relative z-10 w-full">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
							<IconTrendingUp className="w-6 h-6 text-white" />
						</div>
						<p className="text-sm font-medium text-grey-300">
							Net Worth
						</p>
					</div>
					<p className="text-3xl font-bold">
						{formatCurrency(netWorth, currency)}
					</p>
				</div>
			</div>
		</div>
	);
}
