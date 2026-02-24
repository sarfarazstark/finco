'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { PotActions } from './pot-actions';
import { PotAmountDialog } from './pot-amount-dialog';
import type { PotWithTheme } from './pot-dialog';
import type { Theme } from '@prisma/client';

interface PotCardProps {
	pot: PotWithTheme;
	currency: string;
	themes: Theme[];
}

export function PotCard({ pot, currency, themes }: PotCardProps) {
	const [amountDialogType, setAmountDialogType] = useState<
		'add' | 'withdraw' | null
	>(null);

	const themeColor = pot.theme?.hex || '#cccccc';
	const total = pot.total ?? 0;
	const progressPercent = pot.target > 0 ? (total / pot.target) * 100 : 0;

	return (
		<div className="bg-white rounded-xl p-8 flex flex-col gap-8">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div
						className="w-5 h-5 rounded-full"
						style={{ background: themeColor }}
					></div>
					<h2 className="font-preset-2 font-bold">{pot.name}</h2>
				</div>
				<PotActions pot={pot} themes={themes} />
			</div>

			<div className="flex justify-between items-end">
				<p className="font-preset-4 text-grey-500">Total Saved</p>
				<p className="text-[2rem] leading-none font-bold text-grey-900">
					{formatCurrency(total, currency)}
				</p>
			</div>

			<div>
				<div className="w-full h-2 bg-[#F8F4F0] rounded-full overflow-hidden">
					<div
						className="h-full rounded-full transition-all duration-300"
						style={{
							width: `${Math.min(progressPercent, 100)}%`,
							background: themeColor,
						}}
					></div>
				</div>
				<div className="flex justify-between mt-3">
					<p className="font-preset-5 text-grey-500">
						{progressPercent.toFixed(2)}%
					</p>
					<p className="font-preset-5 text-grey-500">
						Target of {formatCurrency(pot.target, currency)}
					</p>
				</div>
			</div>

			<div className="flex gap-4">
				<button
					onClick={() => setAmountDialogType('add')}
					className="flex-1 py-4 rounded-xl font-preset-4 font-bold bg-[#F8F4F0] text-grey-900 hover:bg-[#EDE7E2] transition-colors cursor-pointer"
				>
					+ Add Money
				</button>
				<button
					onClick={() => setAmountDialogType('withdraw')}
					className="flex-1 py-4 rounded-xl font-preset-4 font-bold bg-[#F8F4F0] text-grey-900 hover:bg-[#EDE7E2] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={total <= 0}
				>
					Withdraw
				</button>
			</div>

			{amountDialogType && (
				<PotAmountDialog
					open={!!amountDialogType}
					onOpenChange={open => {
						if (!open) setAmountDialogType(null);
					}}
					type={amountDialogType}
					potId={pot.id}
					potName={pot.name}
					total={total}
					target={pot.target}
					themeColor={themeColor}
					currency={currency}
				/>
			)}
		</div>
	);
}
