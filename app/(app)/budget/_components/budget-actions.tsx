'use client';

import { ActionDropdown, ActionItem } from '@/components/ui/action-dropdown';
import { ConfirmDialog } from '@/components/ui/confirm';
import { useState, useTransition } from 'react';

interface BudgetActionsProps {
	budgetId: string;
	budgetName: string;
}

export function BudgetActions({ budgetId, budgetName }: BudgetActionsProps) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

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
			onClick: () => {
				alert(`Edit budget: ${budgetName} (${budgetId})`);
			},
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
				description={`Are you sure you want to delete "${budgetName}"?`}
				onConfirm={handleDelete}
				variant="destroy"
				isPending={isPending}
			/>
		</>
	);
}
