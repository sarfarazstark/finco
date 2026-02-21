'use client';

import { useState, useTransition } from 'react';
import { cn, getCurrencySymbol } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
	Dropdown,
	DropdownTrigger,
	DropdownValue,
	DropdownContent,
	DropdownItem,
} from '@/components/ui/dropdown';
import { Button } from '../ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { CategorySelectorOverlay, Category } from './category-dialog';
import { AccountDropdown } from './account-dropdown';
import { addTransaction } from '@/app/actions/transactions';
import { AccountSelectorProps } from '../layout/global-add-button';

export function BaseTransactionDialog({
	type,
	open,
	onOpenChange,
	categories,
	accounts,
	settings,
}: {
	type: 'INCOME' | 'EXPENSE';
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categories: Category[];
	accounts: AccountSelectorProps[];
	settings?: { currency: string; theme: string };
}) {
	const [amount, setAmount] = useState('');
	const [name, setName] = useState('');
	const [account, setAccount] = useState('cash');
	const [date, setDate] = useState<Date>(new Date());
	const [categoryId, setCategoryId] = useState<Category | null>(null);
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const [activeTab, setActiveTab] = useState<'one-time' | 'repetitive'>(
		'one-time'
	);
	const [frequency, setFrequency] = useState('30');

	const handleSave = () => {
		if (!amount || !name) return;

		startTransition(async () => {
			const res = await addTransaction({
				type,
				amount: parseFloat(amount),
				name,
				date,
				accountId: account,
				categoryId: categoryId?.id || null,
				recurring: activeTab === 'repetitive',
			});

			if (res.success) {
				onOpenChange(false);
				setAmount('');
				setName('');
				setCategoryId(null);
				setDate(new Date());
			} else {
				console.error(res.error);
			}
		});
	};

	const currencySymbol = getCurrencySymbol(settings?.currency);

	const isIncome = type === 'INCOME';
	const title = isIncome ? 'Add Income' : 'Add Expense';
	const placeholder = isIncome
		? 'Income Source (e.g., Salary)'
		: 'Merchant or Payee';
	const saveText = isIncome ? 'Save Income' : 'Save Expense';
	const borderColor = isIncome ? 'border-green-200' : 'border-red-200';
	const textColor = isIncome ? 'text-green-600' : 'text-red-500';

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent hideClose className="sm:max-w-[400px] p-5">
				<DialogTitle className="sr-only">{title}</DialogTitle>

				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-2 w-full h-11 bg-grey-100 p-1 rounded-lg">
						<button
							type="button"
							onClick={() => setActiveTab('one-time')}
							className={cn(
								'rounded-md text-sm font-medium transition-all duration-200',
								activeTab === 'one-time'
									? 'bg-white text-grey-900 shadow-sm'
									: 'text-grey-500 hover:text-grey-700 hover:bg-grey-200/50'
							)}
						>
							One Time
						</button>
						<button
							type="button"
							onClick={() => setActiveTab('repetitive')}
							className={cn(
								'rounded-md text-sm font-medium transition-all duration-200',
								activeTab === 'repetitive'
									? 'bg-white text-grey-900 shadow-sm'
									: 'text-grey-500 hover:text-grey-700 hover:bg-grey-200/50'
							)}
						>
							Repetitive
						</button>
					</div>

					<div
						className={cn(
							'flex items-center gap-3 p-2 bg-grey-50 rounded-xl border',
							borderColor
						)}
					>
						<button
							type="button"
							onClick={() => setIsCategoryOpen(true)}
							className={cn(
								'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all hover:scale-105 group bg-white',
								categoryId ? categoryId.color : 'text-grey-500'
							)}
							title="Select Category"
						>
							<i
								className={cn(
									'text-2xl',
									categoryId
										? `ti ti-${categoryId.icon}`
										: 'ti ti-category'
								)}
							/>
						</button>

						<div className="flex-1 flex items-center gap-1">
							<span
								className={cn(
									'text-2xl font-bold leading-none flex items-center h-8',
									textColor
								)}
							>
								{currencySymbol}
							</span>
							<input
								type="number"
								autoFocus
								placeholder="0.00"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-grey-900 w-full placeholder:text-grey-300 p-0 leading-none h-8 flex items-center"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex items-center bg-grey-50 rounded-lg border border-grey-200 focus-within:border-grey-300 focus-within:bg-white transition-colors h-11 px-3 gap-2">
							<i className="ti ti-edit text-grey-400 text-lg" />
							<input
								type="text"
								placeholder={placeholder}
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full bg-transparent border-none text-sm font-medium text-grey-900 placeholder:text-grey-400 focus:outline-none focus:ring-0 p-0"
							/>
						</div>

						<AccountDropdown
							accounts={accounts}
							value={account}
							onChange={setAccount}
							currency={settings?.currency}
						/>
					</div>

					<div
						className={cn(
							'grid gap-3 items-end pt-1 transition-all',
							activeTab === 'repetitive'
								? 'grid-cols-2'
								: 'grid-cols-1'
						)}
					>
						<div className="flex flex-col gap-1.5">
							<label className="text-[9px] font-bold text-grey-500 uppercase tracking-widest pl-1">
								Date & Time
							</label>
							<DatePicker
								selected={date}
								onChange={(newDate: Date | null) =>
									setDate(newDate || new Date())
								}
							/>
						</div>

						{activeTab === 'repetitive' && (
							<div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1">
								<label className="text-[9px] font-bold text-grey-500 uppercase tracking-widest pl-1">
									Repeat Every
								</label>
								<Dropdown
									value={frequency}
									onValueChange={setFrequency}
								>
									<DropdownTrigger className="h-11 bg-grey-50 border-grey-200 hover:bg-white">
										<DropdownValue placeholder="Select Frequency" />
									</DropdownTrigger>
									<DropdownContent>
										<DropdownItem value="7">
											7 Days
										</DropdownItem>
										<DropdownItem value="30">
											30 Days
										</DropdownItem>
										<DropdownItem value="180">
											6 Months
										</DropdownItem>
									</DropdownContent>
								</Dropdown>
							</div>
						)}
					</div>

					<div className="flex items-center justify-center gap-2">
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
							onClick={handleSave}
							disabled={
								isPending || !amount || !name || !categoryId
							}
							variant="primary"
							className="w-1/2"
						>
							{isPending ? 'Saving...' : saveText}
						</Button>
					</div>
				</div>

				<CategorySelectorOverlay
					open={isCategoryOpen}
					categories={categories}
					onClose={() => setIsCategoryOpen(false)}
					onSelect={(cat) => {
						setCategoryId(cat);
						setIsCategoryOpen(false);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
