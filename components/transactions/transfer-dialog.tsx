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
	const [fromAccountId, setFromAccountId] = useState('1');
	const [toAccountId, setToAccountId] = useState('2');
	const [date, setDate] = useState(() => {
		const now = new Date();
		now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
		return now.toISOString().slice(0, 16);
	});

	const fromAccount = ACCOUNTS.find(a => a.id === fromAccountId);
	const toAccount = ACCOUNTS.find(a => a.id === toAccountId);
	const currencySymbol = '$';

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-85 p-5 pt-7">
				<div className="flex flex-col gap-6">
					{/* Transfer Header */}
					<div className="flex items-center justify-center gap-6">
						<div className="flex flex-col items-center gap-2">
							<div className="w-12 h-12 rounded-full bg-grey-100 flex items-center justify-center">
								<i
									className={cn(
										'ti ti-' +
											(fromAccount?.icon || 'wallet'),
										'text-xl text-grey-600'
									)}
								/>
							</div>
							<span className="text-[11px] font-bold text-grey-500 uppercase tracking-wider">
								From
							</span>
						</div>
						<i className="ti ti-arrow-right text-grey-300 text-xl" />
						<div className="flex flex-col items-center gap-2">
							<div className="w-12 h-12 rounded-full bg-grey-100 flex items-center justify-center">
								<i
									className={cn(
										'ti ti-' +
											(toAccount?.icon || 'wallet'),
										'text-xl text-grey-600'
									)}
								/>
							</div>
							<span className="text-[11px] font-bold text-grey-500 uppercase tracking-wider">
								To
							</span>
						</div>
					</div>

					{/* Amount */}
					<div className="flex flex-col items-center justify-center my-2">
						<div className="relative flex items-center justify-center w-full max-w-[200px]">
							<div className="absolute left-1 flex items-center gap-1 pointer-events-none text-grey-400">
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
								className="text-center text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-grey-900 w-full placeholder:text-grey-300 py-1 pl-4 pr-4"
							/>
						</div>
					</div>

					{/* Form Fields */}
					<div className="flex flex-col gap-4 mt-2">
						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1.5">
								<label className="text-[11px] font-bold text-grey-500 uppercase tracking-wider pl-1">
									From
								</label>
								<Dropdown
									value={fromAccountId}
									onValueChange={setFromAccountId}
								>
									<DropdownTrigger className="w-full bg-grey-50 border-transparent hover:border-grey-200 focus:border-grey-300 rounded-lg px-3 py-3 h-11.5">
										<div className="flex items-center gap-2">
											<i
												className={cn(
													'ti ti-' +
														(fromAccount?.icon ||
															'wallet'),
													'text-lg text-grey-600'
												)}
											/>
											<span className="text-[13px] font-medium text-grey-900 truncate">
												{fromAccount?.name}
											</span>
										</div>
									</DropdownTrigger>
									<DropdownContent>
										{ACCOUNTS.map(acc => (
											<DropdownItem
												key={acc.id}
												value={acc.id}
											>
												<div className="flex items-center gap-2">
													<i
														className={cn(
															'ti ti-' + acc.icon,
															'text-lg text-grey-600'
														)}
													/>
													<span>{acc.name}</span>
												</div>
											</DropdownItem>
										))}
									</DropdownContent>
								</Dropdown>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="text-[11px] font-bold text-grey-500 uppercase tracking-wider pl-1">
									To
								</label>
								<Dropdown
									value={toAccountId}
									onValueChange={setToAccountId}
								>
									<DropdownTrigger className="w-full bg-grey-50 border-transparent hover:border-grey-200 focus:border-grey-300 rounded-lg px-3 py-3 h-11.5">
										<div className="flex items-center gap-2">
											<i
												className={cn(
													'ti ti-' +
														(toAccount?.icon ||
															'wallet'),
													'text-lg text-grey-600'
												)}
											/>
											<span className="text-[13px] font-medium text-grey-900 truncate">
												{toAccount?.name}
											</span>
										</div>
									</DropdownTrigger>
									<DropdownContent>
										{ACCOUNTS.map(acc => (
											<DropdownItem
												key={acc.id}
												value={acc.id}
											>
												<div className="flex items-center gap-2">
													<i
														className={cn(
															'ti ti-' + acc.icon,
															'text-lg text-grey-600'
														)}
													/>
													<span>{acc.name}</span>
												</div>
											</DropdownItem>
										))}
									</DropdownContent>
								</Dropdown>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
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

						<div className="mt-2">
							<Button
								full
								variant="primary"
								size="lg"
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
