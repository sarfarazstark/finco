'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function AddTransactionDialog() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Add Transaction</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Transaction</DialogTitle>
					<DialogDescription>
						Create a new transaction record down below.
					</DialogDescription>
				</DialogHeader>

				<div className="py-6 space-y-4">
					<div className="text-center p-8 border-2 border-dashed border-grey-200 rounded-lg text-grey-500">
						Form input fields go here...
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="secondary"
						onClick={() => setIsOpen(false)}
					>
						Cancel
					</Button>
					<Button className="bg-grey-900 text-white hover:bg-grey-500 transition-colors">
						Save Transaction
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
