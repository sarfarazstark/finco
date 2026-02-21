'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	Dropdown,
	DropdownTrigger,
	DropdownContent,
	DropdownItem,
} from '@/components/ui/dropdown';
import { DatePicker } from '@/components/ui/date-picker';

const ACCOUNTS = [
	{ id: '1', name: 'Main Account', icon: 'wallet' },
	{ id: '2', name: 'Savings', icon: 'building-bank' },
	{ id: '3', name: 'Investment', icon: 'chart-pie' },
];

export function TransferDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [amount, setAmount] = useState('');
	const [name, setName] = useState('');
	const [fromAccountId, setFromAccountId] = useState('1');
	const [toAccountId, setToAccountId] = useState('2');
	const [date, setDate] = useState<Date>(new Date());

	const fromAccount = ACCOUNTS.find(a => a.id === fromAccountId);
	const toAccount = ACCOUNTS.find(a => a.id === toAccountId);
	const currencySymbol = '$';

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
								<Dropdown
									value={fromAccountId}
									onValueChange={setFromAccountId}
									className="w-full"
								>
									<DropdownTrigger className="h-11 bg-grey-50 border-grey-200 hover:bg-white w-full px-3">
										<div className="flex items-center gap-2 overflow-hidden">
											<i
												className={cn(
													'ti ti-' + (fromAccount?.icon || 'wallet'),
													'text-lg text-grey-400 shrink-0'
												)}
											/>
											<span className="text-sm font-medium text-grey-900 truncate">
												{fromAccount?.name || 'Select Account'}
											</span>
										</div>
									</DropdownTrigger>
									<DropdownContent>
										{ACCOUNTS.map(acc => (
											<DropdownItem key={acc.id} value={acc.id}>
												<div className="flex items-center gap-2">
													<i
														className={cn(
															'ti ti-' + acc.icon,
															'text-lg text-grey-400'
														)}
													/>
													<span className="truncate">{acc.name}</span>
												</div>
											</DropdownItem>
										))}
									</DropdownContent>
								</Dropdown>
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
								<Dropdown
									value={toAccountId}
									onValueChange={setToAccountId}
									className="w-full"
								>
									<DropdownTrigger className="h-11 bg-grey-50 border-grey-200 hover:bg-white w-full px-3">
										<div className="flex items-center gap-2 overflow-hidden">
											<i
												className={cn(
													'ti ti-' + (toAccount?.icon || 'wallet'),
													'text-lg text-grey-400 shrink-0'
												)}
											/>
											<span className="text-sm font-medium text-grey-900 truncate">
												{toAccount?.name || 'Select Account'}
											</span>
										</div>
									</DropdownTrigger>
									<DropdownContent>
										{ACCOUNTS.map(acc => (
											<DropdownItem key={acc.id} value={acc.id}>
												<div className="flex items-center gap-2">
													<i
														className={cn(
															'ti ti-' + acc.icon,
															'text-lg text-grey-400'
														)}
													/>
													<span className="truncate">{acc.name}</span>
												</div>
											</DropdownItem>
										))}
									</DropdownContent>
								</Dropdown>
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
								onClick={() => onOpenChange(false)}
							>
								Transfer Funds
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
