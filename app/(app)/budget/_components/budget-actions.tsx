'use client';

import { ActionDropdown, ActionItem } from '@/components/ui/action-dropdown';

interface BudgetActionsProps {
	budgetId: string;
	budgetName: string;
}

export function BudgetActions({ budgetId, budgetName }: BudgetActionsProps) {
	const actions: ActionItem[] = [
		{
			label: 'Edit',
			icon: 'pencil',
			onClick: () => {
				alert(`Edit budget: ${budgetName} (${budgetId})`);
			},
		},
		{
			label: 'Delete',
			icon: 'trash',
			onClick: () => {
				alert(`Delete budget: ${budgetName} (${budgetId})`);
			},
			className: 'text-red-500 hover:bg-red-50 focus:bg-red-50',
		},
	];

	return <ActionDropdown actions={actions} />;
}
