'use client';

import { ActionDropdown, ActionItem } from '@/components/ui/action-dropdown';
import { ConfirmDialog } from '@/components/ui/confirm';
import { useState, useTransition } from 'react';
import { PotDialog, PotWithTheme } from './pot-dialog';
import { Theme } from '@prisma/client';
import { deletePot } from '@/app/actions/pots';

interface PotActionsProps {
	pot: PotWithTheme;
	themes: Theme[];
}

export function PotActions({ pot, themes }: PotActionsProps) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);

	const handleDelete = () => {
		startTransition(async () => {
			await deletePot({ id: pot.id });
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
				title="Delete Pot"
				description={`Are you sure you want to delete "${pot.name}"? This action cannot be reversed.`}
				onConfirm={handleDelete}
				variant="destroy"
				isPending={isPending}
			/>

			<PotDialog
				open={open}
				setOpen={setOpen}
				type="edit"
				pot={pot}
				themes={themes}
			/>
		</>
	);
}
