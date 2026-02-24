import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import type { Pot, Theme } from '@prisma/client';
import { IconReceipt2 } from '@tabler/icons-react';

export function OverviewPotsWidget({
	pots,
	currency,
}: {
	pots: (Pot & { theme: Theme })[];
	currency: string;
}) {
	const totalSaved = pots.reduce((sum, pot) => sum + pot.total, 0);
	const displayPots = pots.slice(0, 4);

	return (
		<div className="bg-white rounded-xl p-8">
			<div className="flex items-center justify-between mb-5">
				<h2 className="font-preset-2 text-grey-900">Pots</h2>
				<Link
					href="/pots"
					className="font-preset-4 text-grey-500 hover:text-grey-900 transition-colors flex items-center gap-3"
				>
					See Details
					<i className="ti ti-chevron-right text-xs" />
				</Link>
			</div>

			<div className="flex flex-col sm:flex-row gap-5 items-stretch">
				<div className="bg-beige-100 rounded-xl p-6 flex items-center gap-4 sm:w-62 shrink-0">
					<IconReceipt2 className="w-10 h-10 text-green" />
					<div>
						<p className="font-preset-4 text-grey-500 mb-2">
							Total Saved
						</p>
						<p className="text-3xl font-bold text-grey-900 tracking-tight">
							{formatCurrency(totalSaved, currency)}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-x-4 gap-y-6 flex-1 pt-2">
					{displayPots.map(pot => (
						<div
							key={pot.id}
							className="border-l-4 pl-4"
							style={{ borderColor: pot.theme.hex }}
						>
							<p className="font-preset-5 text-grey-500 mb-1">
								{pot.name}
							</p>
							<p className="font-preset-4-bold text-grey-900">
								{formatCurrency(pot.total, currency)}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
