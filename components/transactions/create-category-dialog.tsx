'use client';

import { useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Icon } from '@prisma/client';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { createCategory } from '@/actions/categories';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
	name: z.string().min(1, 'Category name is required').max(30),
	iconId: z.string().min(1, 'Please select an icon'),
});

export function CreateCategoryDialog({
	open,
	onOpenChange,
	dbIcons,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	dbIcons: Icon[];
}) {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			iconId: '',
		},
	});

	const selectedIconId = useWatch({ control: form.control, name: 'iconId' });

	function onSubmit(values: z.infer<typeof formSchema>) {
		startTransition(async () => {
			const result = await createCategory(values);

			if (result.success) {
				toast.success('New category added successfully!');
				form.reset();
				onOpenChange(false);
			} else {
				toast.error(result.error || 'We couldn\'t save that category. Give it another try?');
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-106.25">
				<DialogHeader>
					<DialogTitle>Create New Category</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div>
						<p className="text-xs font-bold text-grey-500 font-preset-5 mb-2">
							Category Name
						</p>
						<Input
							type="text"
							placeholder="e.g. Subscriptions"
							{...form.register('name')}
						/>
						{form.formState.errors.name && (
							<p className="text-sm font-medium text-red-500 mt-2">
								{form.formState.errors.name.message}
							</p>
						)}
					</div>

					<div>
						<p className="text-xs font-bold text-grey-500 font-preset-5 mb-3">
							Select Icon
						</p>
						<div className="grid grid-cols-6 gap-3 max-h-48 overflow-y-auto p-1">
							{dbIcons.map(icon => (
								<button
									key={icon.id}
									type="button"
									onClick={e => {
										e.stopPropagation();
										e.preventDefault();
										form.setValue('iconId', icon.id, {
											shouldValidate: true,
										});
									}}
									className={cn(
										'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer',
										selectedIconId === icon.id
											? `${icon.color} text-white ring-2 ring-offset-2 ring-grey-900 border-none`
											: 'bg-grey-50 text-grey-500 hover:bg-grey-100 border border-grey-100'
									)}
								>
									<i
										className={`ti ti-${icon.name} text-xl`}
									/>
								</button>
							))}
						</div>
						{form.formState.errors.iconId && (
							<p className="text-sm font-medium text-red-500 mt-2">
								{form.formState.errors.iconId.message}
							</p>
						)}
					</div>

					<div className="flex justify-end pt-4">
						<Button
							type="submit"
							disabled={isPending}
							variant="primary"
							className="w-full"
						>
							{isPending ? 'Saving...' : 'Create Category'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
