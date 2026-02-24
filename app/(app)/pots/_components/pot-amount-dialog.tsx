'use client';

import { useState, useTransition } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addToPot, withdrawFromPot } from '@/app/actions/pots';
import { formatCurrency } from '@/lib/utils';

interface PotAmountDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	type: 'add' | 'withdraw';
	potId: string;
	potName: string;
	total: number;
	target: number;
	themeColor: string;
	currency: string;
}

export function PotAmountDialog({
	open,
	onOpenChange,
	type,
	potId,
	potName,
	total,
	target,
	themeColor,
	currency,
}: PotAmountDialogProps) {
	const [amount, setAmount] = useState('');
	const [isPending, startTransition] = useTransition();

	const isAdd = type === 'add';
	const title = isAdd ? `Add to '${potName}'` : `Withdraw from '${potName}'`;
	const description = isAdd
		? 'Add money to your pot to keep saving towards your goal.'
		: 'Withdraw money from your pot back to your balance.';

	const numericAmount = parseFloat(amount) || 0;

	const newTotal = isAdd
		? Math.min(total + numericAmount, target)
		: Math.max(total - numericAmount, 0);

	const progressPercent = target > 0 ? (newTotal / target) * 100 : 0;

	const handleSubmit = () => {
		if (numericAmount <= 0) return;

		startTransition(async () => {
			const action = isAdd ? addToPot : withdrawFromPot;
			const res = await action({ potId, amount: numericAmount });

			if (res && 'error' in res && res.error) {
				alert(res.error);
			} else {
				setAmount('');
				onOpenChange(false);
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-[400px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					<div className="flex justify-between items-center">
						<p className="font-preset-5 text-grey-500">
							New Amount
						</p>
						<p className="font-preset-2 font-bold">
							{formatCurrency(newTotal, currency)}
						</p>
					</div>

					<div className="w-full h-2 bg-[#F8F4F0] rounded-full overflow-hidden">
						<div
							className="h-full rounded-full transition-all duration-300"
							style={{
								width: `${Math.min(progressPercent, 100)}%`,
								background: themeColor,
							}}
						></div>
					</div>

					<div className="flex justify-between">
						<p className="font-preset-5 text-grey-500">
							{progressPercent.toFixed(1)}%
						</p>
						<p className="font-preset-5 text-grey-500">
							Target of {formatCurrency(target, currency)}
						</p>
					</div>

					<div>
						<label
							htmlFor="pot-amount"
							className="font-preset-5-bold text-grey-500 mb-2 inline-block"
						>
							Amount to {isAdd ? 'Add' : 'Withdraw'}
						</label>
						<Input
							type="number"
							id="pot-amount"
							name="pot-amount"
							placeholder="e.g. 500"
							value={amount}
							onChange={e => setAmount(e.target.value)}
							min={0}
							max={isAdd ? target - total : total}
						/>
					</div>

					<Button
						onClick={handleSubmit}
						className="w-full"
						disabled={isPending || numericAmount <= 0}
						variant={isAdd ? 'primary' : 'destroy'}
					>
						{isPending
							? 'Processing...'
							: isAdd
								? `Confirm Addition`
								: `Confirm Withdrawal`}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
