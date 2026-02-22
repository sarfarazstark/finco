import { useState, useTransition } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { addTransaction, updateTransaction } from '@/app/actions/transactions';
import { AccountSelectorProps } from '../layout/global-add-button';
import { AmountSelector } from './amount-selector';
import toast from 'react-hot-toast';

const transactionSchema = z.object({
	amount: z
		.union([z.string(), z.number()])
		.refine(val => Number(val) > 0, 'Amount must be greater than 0'),
	name: z.string().min(1, 'Name is required'),
	accountId: z.string().min(1, 'Account is required'),
	categoryId: z.string().min(1, 'Category is required'),
	date: z.date(),
	recurring: z.boolean().optional(),
	frequency: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export function BaseTransactionDialog({
	type,
	open,
	onOpenChange,
	categories,
	accounts,
	settings,
	transactionId,
	initialData,
}: {
	type: 'INCOME' | 'EXPENSE';
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categories: Category[];
	accounts: AccountSelectorProps[];
	settings?: { currency: string; theme: string };
	transactionId?: string;
	initialData?: {
		amount: number;
		name: string;
		accountId: string;
		categoryId?: string | null;
		date: Date;
		recurring?: boolean;
	};
}) {
	const [isPending, startTransition] = useTransition();
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);

	const defaultCategoryId = initialData?.categoryId
		? categories.find(c => c.id === initialData.categoryId)?.id || ''
		: '';

	const form = useForm<TransactionFormValues>({
		resolver: zodResolver(transactionSchema),
		defaultValues: {
			amount: initialData ? Math.abs(initialData.amount).toString() : '',
			name: initialData?.name || '',
			accountId: initialData?.accountId || 'cash',
			categoryId: defaultCategoryId,
			date: initialData?.date || new Date(),
			recurring: initialData?.recurring || false,
			frequency: '30',
		},
	});

	const { setValue, control, handleSubmit } = form;
	const recurring = useWatch({ control, name: 'recurring' }) || false;
	const selectedCategoryId = useWatch({ control, name: 'categoryId' }) || '';
	const selectedCategory =
		categories.find(c => c.id === selectedCategoryId) || null;
	const amountValue = useWatch({ control, name: 'amount' }) || '';
	const nameValue = useWatch({ control, name: 'name' }) || '';

	const onSubmit = (data: TransactionFormValues) => {
		startTransition(async () => {
			const payload = {
				type,
				amount: Number(data.amount),
				name: data.name,
				date: data.date,
				accountId: data.accountId,
				categoryId: data.categoryId,
				recurring: data.recurring || false,
			};

			const loadingToast = toast.loading(
				transactionId
					? 'Updating transaction...'
					: 'Saving transaction...'
			);

			const res = transactionId
				? await updateTransaction(transactionId, payload)
				: await addTransaction(payload);

			if (res.success) {
				toast.success(
					transactionId
						? 'Transaction updated successfully'
						: 'Transaction saved successfully',
					{ id: loadingToast }
				);
				onOpenChange(false);
				if (!transactionId) {
					form.reset();
				}
			} else {
				console.error(res.error);
				toast.error(res.error || 'Failed to save transaction', {
					id: loadingToast,
				});
			}
		});
	};

	const currencySymbol = getCurrencySymbol(settings?.currency);
	const isIncome = type === 'INCOME';
	const isEdit = !!transactionId;
	const title = isEdit
		? isIncome
			? 'Edit Income'
			: 'Edit Expense'
		: isIncome
			? 'Add Income'
			: 'Add Expense';
	const placeholder = isIncome
		? 'Income Source (e.g., Salary)'
		: 'Merchant or Payee';
	const saveText = isEdit
		? 'Update Transaction'
		: isIncome
			? 'Save Income'
			: 'Save Expense';
	const borderColor = isIncome ? 'border-green-200' : 'border-red-200';
	const textColor = isIncome ? 'text-green-600' : 'text-red-500';

	const canSave =
		Number(amountValue) > 0 &&
		nameValue.trim().length > 0 &&
		selectedCategoryId;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				key={transactionId || 'new'}
				hideClose
				className="sm:max-w-[400px] p-5"
			>
				<DialogTitle className="sr-only">{title}</DialogTitle>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<div className="grid grid-cols-2 w-full h-11 bg-grey-100 p-1 rounded-lg">
						<button
							type="button"
							onClick={() =>
								setValue('recurring', false, {
									shouldValidate: true,
								})
							}
							className={cn(
								'rounded-md text-sm font-medium transition-all duration-200',
								!recurring
									? 'bg-white text-grey-900 shadow-sm'
									: 'text-grey-500 hover:text-grey-700 hover:bg-grey-200/50'
							)}
						>
							One Time
						</button>
						<button
							type="button"
							onClick={() =>
								setValue('recurring', true, {
									shouldValidate: true,
								})
							}
							className={cn(
								'rounded-md text-sm font-medium transition-all duration-200',
								recurring
									? 'bg-white text-grey-900 shadow-sm'
									: 'text-grey-500 hover:text-grey-700 hover:bg-grey-200/50'
							)}
						>
							Repetitive
						</button>
					</div>

					<Controller
						control={control}
						name="amount"
						render={({ field }) => (
							<AmountSelector
								amount={field.value || ''}
								onAmountChange={field.onChange}
								categoryId={selectedCategory}
								onCategoryClick={() => setIsCategoryOpen(true)}
								borderColor={borderColor}
								textColor={textColor}
								currencySymbol={currencySymbol}
							/>
						)}
					/>

					<div className="flex flex-col gap-3">
						<div className="flex items-center bg-grey-50 rounded-lg border border-grey-200 focus-within:border-grey-300 focus-within:bg-white transition-colors h-11 px-3 gap-2">
							<i className="ti ti-edit text-grey-400 text-lg" />
							<Controller
								control={control}
								name="name"
								render={({ field }) => (
									<input
										type="text"
										{...field}
										placeholder={placeholder}
										className="w-full bg-transparent border-none text-sm font-medium text-grey-900 placeholder:text-grey-400 focus:outline-none focus:ring-0 p-0"
									/>
								)}
							/>
						</div>

						<Controller
							control={control}
							name="accountId"
							render={({ field }) => (
								<AccountDropdown
									accounts={accounts}
									value={field.value}
									onChange={field.onChange}
									currency={settings?.currency}
								/>
							)}
						/>
					</div>

					<div
						className={cn(
							'grid gap-3 items-end pt-1 transition-all',
							recurring ? 'grid-cols-2' : 'grid-cols-1'
						)}
					>
						<div className="flex flex-col gap-1.5">
							<label className="text-[9px] font-medium text-grey-500 tracking-widest pl-1">
								Date & Time
							</label>
							<Controller
								control={control}
								name="date"
								render={({ field }) => (
									<DatePicker
										selected={field.value}
										onChange={(newDate: Date | null) =>
											field.onChange(
												newDate || new Date()
											)
										}
									/>
								)}
							/>
						</div>

						{recurring && (
							<div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1">
								<label className="text-[9px] font-medium text-grey-500 tracking-widest pl-1">
									Repeat Every
								</label>
								<Controller
									control={control}
									name="frequency"
									render={({ field }) => (
										<Dropdown
											value={field.value || '30'}
											onValueChange={field.onChange}
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
									)}
								/>
							</div>
						)}
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
							type="submit"
							disabled={isPending || !canSave}
							variant="primary"
							className="w-1/2"
						>
							{isPending ? 'Saving...' : saveText}
						</Button>
					</div>
				</form>

				<CategorySelectorOverlay
					open={isCategoryOpen}
					categories={categories}
					onClose={() => setIsCategoryOpen(false)}
					onSelect={cat => {
						setValue('categoryId', cat.id, {
							shouldValidate: true,
						});
						setIsCategoryOpen(false);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
