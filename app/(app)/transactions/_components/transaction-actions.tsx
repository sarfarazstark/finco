'use client';

import { useState, useTransition, useRef } from 'react';
import { deleteTransaction } from '@/app/actions/transactions';
import { useClickOutside } from '@/hooks/use-click-outside';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '@/components/transactions/category-dialog';
import { AccountSelectorProps } from '@/components/layout/global-add-button';
import { IncomeDialog } from '@/components/transactions/income-dialog';
import { ExpenseDialog } from '@/components/transactions/expense-dialog';
import { TransferDialog } from '@/components/transactions/transfer-dialog';

interface TransactionWithRelations {
	id: string;
	type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
	amount: number;
	name: string;
	date: Date;
	accountId: string;
	categoryId: string | null;
	transferId: string | null;
}

export function TransactionActions({
	transaction,
	categories,
	accounts,
	settings,
}: {
	transaction: TransactionWithRelations;
	categories: Category[];
	accounts: AccountSelectorProps[];
	settings: { currency: string; theme: string };
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [activeDialog, setActiveDialog] = useState<
		'INCOME' | 'EXPENSE' | 'TRANSFER' | null
	>(null);
	const [isPending, startTransition] = useTransition();
	const menuRef = useRef<HTMLDivElement>(null);

	useClickOutside(menuRef, () => setIsOpen(false));

	const handleDelete = async () => {
		setIsOpen(false);
		if (
			!window.confirm('Are you sure you want to delete this transaction?')
		) {
			return;
		}
		startTransition(async () => {
			const res = await deleteTransaction(transaction.id);
			if (res?.error) {
				alert(res.error);
			}
		});
	};

	const handleEdit = () => {
		setIsOpen(false);
		setActiveDialog(transaction.type);
	};

	// For Transfers, we need to know the 'from' and 'to' accounts.
	// We only have the 'accountId' of the current record.
	// However, usually we can assume if amount < 0, it's the 'from' account.
	// But in a transfer, the records are linked.
	// To keep it simple for now, if it's a transfer, we'll use the record we have
	// as the 'from' account if it's negative, otherwise 'to'.
	const isTransfer = transaction.type === 'TRANSFER';
	const inflow = transaction.amount > 0;

	const transferInitialData = isTransfer ? {
		amount: Math.abs(transaction.amount),
		name: transaction.name,
		fromAccountId: inflow ? '' : transaction.accountId,
		toAccountId: inflow ? transaction.accountId : '',
		date: new Date(transaction.date)
	} : undefined;

	return (
		<>
			<div className="relative inline-block" ref={menuRef}>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="w-8 h-8 rounded-full flex items-center justify-center text-grey-500 hover:text-grey-900 hover:bg-grey-100 transition-colors focus:outline-none"
				>
					<i className="ti ti-dots-vertical text-lg" />
				</button>

				<AnimatePresence>
					{isOpen && (
						<motion.div
							key="transaction-actions-menu"
							initial={{ opacity: 0, scale: 0.95, y: -10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: -10 }}
							transition={{ duration: 0.15, ease: 'easeOut' }}
							className="absolute right-0 top-full mt-1 z-50 w-36 bg-white border border-grey-200 rounded-lg shadow-custom overflow-hidden py-1"
						>
							<button
								type="button"
								onClick={handleEdit}
								className="w-full text-left px-4 py-2 text-sm text-grey-700 hover:bg-grey-50 hover:text-grey-900 flex items-center gap-2 transition-colors"
							>
								<i className="ti ti-pencil text-lg" />
								<span>Edit</span>
							</button>
							<button
								type="button"
								onClick={handleDelete}
								disabled={isPending}
								className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 focus:bg-red-50 flex items-center gap-2 transition-colors"
							>
								<i className="ti ti-trash text-lg" />
								<span>
									{isPending ? 'Deleting...' : 'Delete'}
								</span>
							</button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Render Dialogs */}
			{activeDialog === 'INCOME' && (
				<IncomeDialog
					open={true}
					onOpenChange={() => setActiveDialog(null)}
					categories={categories}
					accounts={accounts}
					settings={settings}
					transactionId={transaction.id}
					initialData={{
						amount: transaction.amount,
						name: transaction.name,
						accountId: transaction.accountId,
						categoryId: transaction.categoryId,
						date: new Date(transaction.date),
					}}
				/>
			)}

			{activeDialog === 'EXPENSE' && (
				<ExpenseDialog
					open={true}
					onOpenChange={() => setActiveDialog(null)}
					categories={categories}
					accounts={accounts}
					settings={settings}
					transactionId={transaction.id}
					initialData={{
						amount: transaction.amount,
						name: transaction.name,
						accountId: transaction.accountId,
						categoryId: transaction.categoryId,
						date: new Date(transaction.date),
					}}
				/>
			)}

			{activeDialog === 'TRANSFER' && transferInitialData && (
				<TransferDialog
					open={true}
					onOpenChange={() => setActiveDialog(null)}
					accounts={accounts}
					settings={settings}
					transactionId={transaction.id}
					initialData={transferInitialData as {
						amount: number;
						name: string;
						fromAccountId: string;
						toAccountId: string;
						date: Date;
					}}
				/>
			)}
		</>
	);
}
