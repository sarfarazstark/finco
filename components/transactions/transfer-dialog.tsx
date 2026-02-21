'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';
import { AccountDropdown } from './account-dropdown';
import { addTransaction } from '@/app/actions/transactions';
import { AccountSelectorProps } from '../layout/global-add-button';

export function TransferDialog({
	open,
	onOpenChange,
	accounts,
	settings,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	accounts: AccountSelectorProps[];
	settings?: { currency: string; theme: string };
}) {
	const [amount, setAmount] = useState('');
	const [name, setName] = useState('');
	const [fromAccountId, setFromAccountId] = useState('1');
	const [toAccountId, setToAccountId] = useState('2');
	const [date, setDate] = useState<Date>(new Date());
	const [isPending, startTransition] = useTransition();

	const handleSave = () => {
		if (!amount || !name || !fromAccountId || !toAccountId) return;
		if (fromAccountId === toAccountId) return; // Can't transfer to same account

		startTransition(async () => {
			const res = await addTransaction({
				type: 'TRANSFER',
				amount: parseFloat(amount),
				name,
				date,
				accountId: fromAccountId,
				toAccountId: toAccountId,
			});

			if (res.success) {
				onOpenChange(false);
				setAmount('');
				setName('');
				setDate(new Date());
			} else {
				console.error(res.error);
			}
		});
	};


	const currencySymbol = getCurrencySymbol(settings?.currency);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-85 p-5 pt-7">
				<div className="flex flex-col gap-4">

					{/* Amount */}
					<div className="flex items-center justify-center my-2 p-2 bg-grey-50 rounded-xl border border-grey-200">
						<div className="flex items-center justify-center w-full max-w-[200px] relative">
							<div className="absolute left-0 flex items-center justify-center pointer-events-none text-grey-400">
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
								className="text-center text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-grey-900 w-full placeholder:text-grey-300 p-0 pl-8 tracking-tight h-12"
							/>
						</div>
					</div>

					{/* Form Fields */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center bg-grey-50 rounded-lg border border-grey-200 focus-within:border-grey-300 focus-within:bg-white transition-colors h-11 px-3 gap-2">
							<i className="ti ti-edit text-grey-400 text-lg" />
							<input
								type="text"
								placeholder="What is this transfer for?"
								value={name}
								onChange={e => setName(e.target.value)}
								className="w-full bg-transparent border-none text-sm font-medium text-grey-900 placeholder:text-grey-400 focus:outline-none focus:ring-0 p-0"
							/>
						</div>

						<div className="flex flex-col">
							<div className="flex flex-col gap-1.5">
								<label className="text-[10px] font-bold text-grey-500 uppercase tracking-wider pl-1">
									From
								</label>
								<AccountDropdown
									accounts={accounts}
									value={fromAccountId}
									onChange={setFromAccountId}
									currency={settings?.currency}
								/>
							</div>

							<div className="relative h-2 flex justify-center items-center z-10">
								<button
									type="button"
									onClick={() => {
										const prevFrom = fromAccountId;
										setFromAccountId(toAccountId);
										setToAccountId(prevFrom);
									}}
									className="w-10 h-10 rounded-full bg-white border border-grey-200 flex items-center justify-center text-grey-500 hover:text-grey-900 hover:border-grey-300 hover:shadow-md transition-all group"
									title="Swap Accounts"
								>
									<i className="ti ti-arrows-vertical text-xl transition-transform duration-300 group-hover:rotate-180" />
								</button>
							</div>

							<div className="flex flex-col gap-1.5 mt-1">
								<label className="text-[10px] font-bold text-grey-500 uppercase tracking-wider pl-1">
									To
								</label>
								<AccountDropdown
									accounts={accounts}
									value={toAccountId}
									onChange={setToAccountId}
									currency={settings?.currency}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-1.5 pt-1">
							<label className="text-[9px] font-bold text-grey-500 uppercase tracking-widest pl-1">
								Date & Time
							</label>
							<DatePicker
								selected={date}
								onChange={(newDate: Date | null) => setDate(newDate || new Date())}
							/>
						</div>

						<div className="flex items-center justify-center gap-2 mt-2">
							<Button
								type="button"
								variant="tertiary"
								className="w-1/2"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button
								type="button"
								variant="primary"
								className="w-1/2"
								onClick={handleSave}
								disabled={isPending || !amount || !name || fromAccountId === toAccountId}
							>
								{isPending ? 'Transferring...' : 'Transfer Funds'}
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
