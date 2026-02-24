'use client';

import { useTransition, useMemo, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { budgetSchema } from '@/lib/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category, Icon, Budget, Theme } from '@prisma/client';
import {
	Dropdown,
	DropdownTrigger,
	DropdownValue,
	DropdownContent,
	DropdownItem,
} from '@/components/ui/dropdown';
import { createBudget, updateBudget } from '@/app/actions/budget';

export type CategoryWithIcon = Partial<Category> & {
	id: string;
	name: string;
	icon: Icon;
	budgets?: (Budget & { theme?: Theme })[];
};

const BUDGET_PERIODS = [
	{ id: 'WEEKLY', name: 'Weekly' },
	{ id: 'MONTHLY', name: 'Monthly' },
	{ id: 'QUARTERLY', name: 'Quarterly' },
	{ id: 'YEARLY', name: 'Yearly' },
] as const;

export const BudgetDialog = ({
	open,
	setOpen,
	type,
	category,
	categories,
	themes,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	type: 'create' | 'edit';
	category?: CategoryWithIcon;
	categories: CategoryWithIcon[];
	themes: Theme[];
}) => {
	const isEdit = type === 'edit';
	const title = isEdit ? 'Edit Budget' : 'Create Budget';
	const description = isEdit
		? 'As your budgets change, feel free to update your spending limits.'
		: 'Choose a category to set a spending budget. These categories can help you monitor spending.';

	const form = useForm<z.infer<typeof budgetSchema>>({
		resolver: zodResolver(budgetSchema),
		defaultValues: {
			categoryId: category?.id || '',
			themeId: category?.budgets?.[0]?.themeId || '',
			maximum: category?.budgets?.[0]?.maximum || 0,
			type: category?.budgets?.[0]?.type || 'MONTHLY',
		},
	});

	const {
		handleSubmit,
		control,
		register,
		formState: { errors },
	} = form;
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		form.reset({
			categoryId: category?.id || '',
			themeId: category?.budgets?.[0]?.themeId || '',
			maximum: category?.budgets?.[0]?.maximum || 0,
			type: category?.budgets?.[0]?.type || 'MONTHLY',
		});
	}, [open, category, form]);

	const categoryMap = useMemo(() => {
		const map = new Map<string, CategoryWithIcon>();
		categories.forEach(cat => map.set(cat.id, cat));
		return map;
	}, [categories]);

	const themeMap = useMemo(() => {
		const map = new Map<string, Theme>();
		themes.forEach(theme => map.set(theme.id, theme));
		return map;
	}, [themes]);

	const onSubmit = async (data: z.infer<typeof budgetSchema>) => {
		startTransition(async () => {
			let res;
			if (isEdit && category?.budgets?.[0]) {
				res = await updateBudget(category.budgets[0].id, data);
			} else {
				res = await createBudget(data);
			}

			if (res && 'error' in res && res.error) {
				alert(res.error);
			} else {
				setOpen(false);
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<div>
						<p className="font-preset-5-bold text-grey-500 mb-2">
							Budget Category
						</p>
						<Controller
							control={control}
							name="categoryId"
							render={({ field }) => (
								<Dropdown
									defaultValue={field.value}
									onValueChange={field.onChange}
									className="w-full"
								>
									<DropdownTrigger className="w-full border border-grey-200 rounded-lg px-4 py-2 h-10 bg-white">
										<DropdownValue
											placeholder="Category"
											className="flex items-center gap-2"
										>
											{(value: string | undefined) => {
												const selectedCat = value
													? categoryMap.get(value)
													: undefined;
												return value && selectedCat ? (
													<>
														<i
															className={`ti ti-${selectedCat.icon.name} ${selectedCat.icon.color} text-white text-sm items-center w-5 h-5 rounded-full flex align-center justify-center`}
														></i>
														<span>
															{selectedCat.name}
														</span>
													</>
												) : (
													'Category'
												);
											}}
										</DropdownValue>
									</DropdownTrigger>
									<DropdownContent>
										{categories.map(cat => (
											<DropdownItem
												key={cat.id}
												value={cat.id}
												className="flex items-center gap-2"
											>
												<i
													className={`ti ti-${cat.icon.name} ${cat.icon.color} text-white text-sm items-center w-5 h-5 rounded-full flex align-center justify-center`}
												></i>
												<span>{cat.name}</span>
											</DropdownItem>
										))}
									</DropdownContent>
								</Dropdown>
							)}
						/>
						{errors.categoryId && (
							<p className="text-red-500 text-xs mt-1">
								{errors.categoryId.message}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor="maximum"
							className="font-preset-5-bold text-grey-500 mb-2 inline-block"
						>
							Maximum Spend
						</label>
						<Input
							type="number"
							id="maximum"
							placeholder="$ e.g. 2000"
							{...register('maximum', { valueAsNumber: true })}
							error={errors.maximum?.message}
						/>
					</div>
					<div>
						<p className="font-preset-5-bold text-grey-500 mb-2">
							Period
						</p>
						<Controller
							control={control}
							name="type"
							render={({ field }) => (
								<Dropdown
									defaultValue={field.value}
									onValueChange={field.onChange}
									className="w-full"
								>
									<DropdownTrigger className="w-full border border-grey-200 rounded-lg px-4 py-2 h-10 bg-white">
										<DropdownValue
											placeholder="Period"
											className="capitalize text-grey-900"
										>
											{value =>
												value
													? value.toLowerCase()
													: 'Period'
											}
										</DropdownValue>
									</DropdownTrigger>
									<DropdownContent>
										{BUDGET_PERIODS.map(period => (
											<DropdownItem
												key={period.id}
												value={period.id}
											>
												{period.name}
											</DropdownItem>
										))}
									</DropdownContent>
								</Dropdown>
							)}
						/>
						{errors.type && (
							<p className="text-red-500 text-xs mt-1">
								{errors.type.message}
							</p>
						)}
					</div>
					<div>
						<p className="font-preset-5-bold text-grey-500 mb-2">
							Theme
						</p>
						<Controller
							control={control}
							name="themeId"
							render={({ field }) => (
								<Dropdown
									defaultValue={field.value}
									onValueChange={field.onChange}
									className="w-full"
								>
									<DropdownTrigger className="w-full border border-grey-200 rounded-lg px-4 py-2 h-10 bg-white">
										<DropdownValue
											placeholder="Theme"
											className="flex items-center gap-2"
										>
											{(value: string | undefined) => {
												const selectedTheme = value
													? themeMap.get(value)
													: undefined;
												return value &&
													selectedTheme ? (
													<>
														<span
															className="w-5 h-5 rounded-full border border-grey-200"
															style={{
																background:
																	selectedTheme.hex,
															}}
														></span>
														<span>
															{selectedTheme.name}
														</span>
													</>
												) : (
													'Theme'
												);
											}}
										</DropdownValue>
									</DropdownTrigger>
									<DropdownContent>
										{themes.map(theme => (
											<DropdownItem
												key={theme.id}
												value={theme.id}
												className="flex items-center gap-2"
											>
												<span
													className="w-5 h-5 rounded-full border border-grey-200"
													style={{
														background: theme.hex,
													}}
												></span>
												<span>{theme.name}</span>
											</DropdownItem>
										))}
									</DropdownContent>
								</Dropdown>
							)}
						/>
						{errors.themeId && (
							<p className="text-red-500 text-xs mt-1">
								{errors.themeId.message}
							</p>
						)}
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={isPending}
					>
						{isPending
							? isEdit
								? 'Saving...'
								: 'Creating...'
							: isEdit
								? 'Save Changes'
								: 'Create'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};
