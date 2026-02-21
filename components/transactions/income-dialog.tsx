'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

export function IncomeDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [amount, setAmount] = useState('');
	const [name, setName] = useState('');
	const [date, setDate] = useState(() => {
		const now = new Date();
		now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
		return now.toISOString().slice(0, 16);
	});
	const [isRecurring, setIsRecurring] = useState(false);

	const currencySymbol = '$';

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-85 p-5 pt-7">
				<div className="flex flex-col gap-6">
					{/* Name & Icon Row */}
					<div className="flex items-center gap-4 w-full">
						<div
							className={cn(
								'w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-green/10'
							)}
						>
							<i
								className={cn(
									'ti ti-cash',
									'text-2xl text-green'
								)}
							/>
						</div>
						<div className="flex-1">
							<input
								type="text"
								placeholder="Income Source"
								value={name}
								onChange={e => setName(e.target.value)}
								className="w-full bg-transparent border-none text-xl font-bold text-grey-900 placeholder:text-grey-300 focus:outline-none focus:ring-0 px-0"
							/>
						</div>
					</div>

					{/* Amount */}
					<div className="flex flex-col items-center justify-center my-2">
						<div className="relative flex items-center justify-center w-full max-w-[200px]">
							<div className="absolute left-1 flex items-center gap-1 pointer-events-none text-grey-400">
								<span className="text-2xl font-bold">+</span>
								<span className="text-2xl font-bold">
									{currencySymbol}
								</span>
							</div>
							<input
								type="number"
								autoFocus
								placeholder="0.00"
								value={amount}
								onChange={e => setAmount(e.target.value)}
								className="text-center text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-grey-900 w-full placeholder:text-grey-300 py-1 pl-6 pr-4"
							/>
						</div>
					</div>

					{/* Form Fields: Category, Date, Recurring */}
					<div className="flex flex-col gap-4 mt-2">
						<div className="flex flex-col gap-1.5">
							<label className="text-[11px] font-bold text-grey-500 uppercase tracking-wider pl-1">
								Category
							</label>
							<Button
								variant="secondary"
								className="w-full bg-grey-50 border-transparent hover:border-grey-200 justify-start h-11.5 px-4 font-medium text-grey-900"
								onClick={() => {}}
							>
								<div className="flex items-center gap-2">
									<i className="ti ti-category text-lg text-grey-400" />
									<span>Select Category</span>
								</div>
							</Button>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1.5 flex-1">
								<label className="text-[11px] font-bold text-grey-500 uppercase tracking-wider pl-1">
									Date & Time
								</label>
								<input
									type="datetime-local"
									value={date}
									onChange={e => setDate(e.target.value)}
									className="w-full bg-grey-50 border border-transparent hover:border-grey-200 focus:border-grey-300 rounded-lg px-3 py-3 text-[13px] font-medium text-grey-900 focus:outline-none focus:bg-white transition-all h-11.5"
								/>
							</div>

							<div className="flex flex-col gap-1.5 justify-center">
								<label className="text-[11px] font-bold text-grey-500 uppercase tracking-wider text-right pr-2">
									Recurring
								</label>
								<div className="h-11.5 flex items-center justify-end pr-2">
									<Switch
										checked={isRecurring}
										onCheckedChange={setIsRecurring}
									/>
								</div>
							</div>
						</div>

						<div className="mt-2">
							<Button
								full
								variant="primary"
								size="lg"
								onClick={() => onOpenChange(false)}
							>
								Save Income
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
