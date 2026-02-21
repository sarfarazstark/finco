'use client';

import { useState, useTransition, useRef } from 'react';
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
import { Input } from '@/components/ui/input';
import { createTransaction } from '@/app/actions/transactions';
import {
	Dropdown,
	DropdownTrigger,
	DropdownValue,
	DropdownContent,
	DropdownItem,
} from '@/components/ui/dropdown';

interface AddTransactionDialogProps {
	categories: { id: string; name: string }[];
	accounts: { id: string; name: string }[];
}

export function AddTransactionDialog({
	categories,
	accounts,
}: AddTransactionDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	const [selectedAccountId, setSelectedAccountId] = useState(
		accounts[0]?.id || ''
	);
	const [selectedCategoryId, setSelectedCategoryId] = useState(
		categories[0]?.id || ''
	);
	const [selectedType, setSelectedType] = useState('EXPENSE');

	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = (formData: FormData) => {
		setError(null);

		formData.set('accountId', selectedAccountId);
		formData.set('categoryId', selectedCategoryId);
		formData.set('type', selectedType);

		startTransition(async () => {
			const result = await createTransaction(formData);

			if (result.success) {
				setIsOpen(false);
				formRef.current?.reset();
			} else {
				setError(result.error || 'Failed to create transaction');
			}
		});
	};

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

				<form
					action={handleSubmit}
					ref={formRef}
					className="py-6 space-y-4"
				>
					{error && (
						<p className="text-red text-sm font-semibold">
							{error}
						</p>
					)}

					<Input
						id="name"
						name="name"
						label="Transaction Name"
						placeholder="e.g. Groceries"
						type="text"
						required
					/>

					<div className="flex gap-4">
						<div className="flex-1">
							<Input
								id="amount"
								name="amount"
								label="Amount"
								placeholder="0.00"
								type="number"
								step="0.01"
								required
							/>
						</div>
						<div className="flex-1">
							<Input
								id="date"
								name="date"
								label="Date"
								type="date"
								required
								defaultValue={
									new Date().toISOString().split('T')[0]
								}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-grey-900 font-semibold text-xs">
							Account
						</label>
						<Dropdown
							defaultValue={selectedAccountId}
							onValueChange={setSelectedAccountId}
						>
							<DropdownTrigger className="w-full border border-grey-500 rounded-md px-4 py-2 text-left bg-white">
								<DropdownValue placeholder="Select Account" />
							</DropdownTrigger>
							<DropdownContent>
								{accounts.map(acc => (
									<DropdownItem key={acc.id} value={acc.id}>
										{acc.name}
									</DropdownItem>
								))}
							</DropdownContent>
						</Dropdown>
					</div>

					<div className="flex gap-4">
						<div className="flex-1 flex flex-col gap-2">
							<label className="text-grey-900 font-semibold text-xs">
								Type
							</label>
							<Dropdown
								defaultValue={selectedType}
								onValueChange={setSelectedType}
							>
								<DropdownTrigger className="w-full border border-grey-500 rounded-md px-4 py-2 text-left bg-white">
									<DropdownValue placeholder="Select Type" />
								</DropdownTrigger>
								<DropdownContent>
									<DropdownItem value="EXPENSE">
										Expense
									</DropdownItem>
									<DropdownItem value="INCOME">
										Income
									</DropdownItem>
									<DropdownItem value="TRANSFER">
										Transfer
									</DropdownItem>
								</DropdownContent>
							</Dropdown>
						</div>
						<div className="flex-1 flex flex-col gap-2">
							<label className="text-grey-900 font-semibold text-xs">
								Category
							</label>
							<Dropdown
								defaultValue={selectedCategoryId}
								onValueChange={setSelectedCategoryId}
							>
								<DropdownTrigger className="w-full border border-grey-500 rounded-md px-4 py-2 text-left bg-white">
									<DropdownValue placeholder="Select Category" />
								</DropdownTrigger>
								<DropdownContent>
									{categories.map(cat => (
										<DropdownItem
											key={cat.id}
											value={cat.id}
										>
											{cat.name}
										</DropdownItem>
									))}
								</DropdownContent>
							</Dropdown>
						</div>
					</div>

					<DialogFooter className="mt-8">
						<Button
							type="button"
							variant="secondary"
							onClick={() => setIsOpen(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isPending}
							className="bg-grey-900 text-white hover:bg-grey-500 transition-colors"
						>
							{isPending ? 'Saving...' : 'Save Transaction'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
