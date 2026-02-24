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
import { z } from 'zod/v4';
import { potSchema } from '@/lib/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Theme, Pot } from '@prisma/client';
import {
	Dropdown,
	DropdownTrigger,
	DropdownValue,
	DropdownContent,
	DropdownItem,
} from '@/components/ui/dropdown';
import { createPot, updatePot } from '@/app/actions/pots';

export type PotWithTheme = Pot & { theme: Theme };

interface PotDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	type: 'create' | 'edit';
	pot?: PotWithTheme;
	themes: Theme[];
}

export function PotDialog({
	open,
	setOpen,
	type,
	pot,
	themes,
}: PotDialogProps) {
	const isEdit = type === 'edit';
	const title = isEdit ? 'Edit Pot' : 'Add New Pot';
	const description = isEdit
		? 'If your saving targets change, feel free to update your pots.'
		: 'Create a pot to set savings targets. These can help you save for special purchases.';

	const form = useForm<z.infer<typeof potSchema>>({
		resolver: zodResolver(potSchema),
		defaultValues: {
			id: pot?.id || '',
			name: pot?.name || '',
			target: pot?.target || 0,
			themeId: pot?.themeId || '',
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
			id: pot?.id || '',
			name: pot?.name || '',
			target: pot?.target || 0,
			themeId: pot?.themeId || '',
		});
	}, [open, pot, form]);

	const themeMap = useMemo(() => {
		const map = new Map<string, Theme>();
		themes.forEach(theme => map.set(theme.id, theme));
		return map;
	}, [themes]);

	const onSubmit = async (data: z.infer<typeof potSchema>) => {
		startTransition(async () => {
			let res;
			if (isEdit && pot) {
				res = await updatePot({ ...data, id: pot.id });
			} else {
				res = await createPot(data);
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
						<label
							htmlFor="name"
							className="font-preset-5-bold text-grey-500 mb-2 inline-block"
						>
							Pot Name
						</label>
						<Input
							type="text"
							id="name"
							placeholder="e.g. Rainy Days"
							{...register('name')}
							error={errors.name?.message}
						/>
					</div>
					<div>
						<label
							htmlFor="target"
							className="font-preset-5-bold text-grey-500 mb-2 inline-block"
						>
							Target
						</label>
						<Input
							type="number"
							id="target"
							placeholder="e.g. 2000"
							{...register('target', { valueAsNumber: true })}
							error={errors.target?.message}
						/>
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
															{
																selectedTheme.name
															}
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
								: 'Add Pot'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
