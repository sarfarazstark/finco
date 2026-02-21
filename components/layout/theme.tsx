'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function Theme() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Add Transaction</Button>
			</DialogTrigger>
			<DialogContent>
				<div className="py-6 space-y-4"></div>

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
