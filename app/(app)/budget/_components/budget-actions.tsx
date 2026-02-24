'use client';

import { ActionDropdown, ActionItem } from '@/components/ui/action-dropdown';
import { ConfirmDialog } from '@/components/ui/confirm';
import { useState, useTransition } from 'react';
import { BudgetDialog, CategoryWithIcon } from './budget-dialog';
import { Theme } from '@prisma/client';

interface BudgetActionsProps {
	category: CategoryWithIcon;
	categories: CategoryWithIcon[];
	themes: Theme[];
}

export function BudgetActions({
	category,
	categories,
	themes,
}: BudgetActionsProps) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);

	const handleDelete = () => {
		startTransition(async () => {
			setIsDeleteDialogOpen(false);
		});
	};

	const actions: ActionItem[] = [
		{
			label: 'Edit',
			icon: 'pencil',
			disabled: isPending,
			onClick: () => setOpen(true),
		},
		{
			label: 'Delete',
			icon: 'trash',
			disabled: isPending,
			onClick: () => setIsDeleteDialogOpen(true),
			className: 'text-red-500 hover:bg-red-50 focus:bg-red-50',
		},
	];

	return (
		<>
			<ActionDropdown actions={actions} />
			<ConfirmDialog
				isOpen={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				title="Delete Budget"
				description={`Are you sure you want to delete "${category.name}"?`}
				onConfirm={handleDelete}
				variant="destroy"
				isPending={isPending}
			/>

			<BudgetDialog
				open={open}
				setOpen={setOpen}
				type="edit"
				category={category}
				categories={categories}
				themes={themes}
			/>
		</>
	);
}
