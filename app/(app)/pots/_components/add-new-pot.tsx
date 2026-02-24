'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PotDialog } from './pot-dialog';
import { Theme } from '@prisma/client';

export function AddNewPot({ themes }: { themes: Theme[] }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setOpen(true)} variant="primary">
				+ Add New Pot
			</Button>
			<PotDialog
				open={open}
				setOpen={setOpen}
				type="create"
				themes={themes}
			/>
		</>
	);
}
