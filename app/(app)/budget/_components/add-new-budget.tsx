'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { BudgetDialog, CategoryWithIcon } from './budget-dialog';
import { Theme } from '@prisma/client';

export function AddNewBudget({
	categories,
	themes,
}: {
	categories: CategoryWithIcon[];
	themes: Theme[];
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setOpen(true)} variant="primary">
				+ Add New Budget
			</Button>
			<BudgetDialog
				open={open}
				setOpen={setOpen}
				type="create"
				categories={categories}
				themes={themes}
			/>
		</>
	);
}
