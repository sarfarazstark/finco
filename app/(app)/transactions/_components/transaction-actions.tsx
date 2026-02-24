'use client';

import { useState, useTransition } from 'react';
import { deleteTransaction } from '@/app/actions/transactions';
import { ActionDropdown, ActionItem } from '@/components/ui/action-dropdown';
import { Category } from '@/components/transactions/category-dialog';
import { AccountSelectorProps } from '@/components/layout/global-add-button';
import { BaseTransactionDialog } from '@/components/transactions/base-transaction-dialog';
import { TransferDialog } from '@/components/transactions/transfer-dialog';

import { TransactionWithRelations } from '@/components/transactions/resolved-image';
import { Setting } from '@prisma/client';

import { ConfirmDialog } from '@/components/ui/confirm';

export function TransactionActions({
	transaction,
	categories,
	accounts,
	settings,
}: {
	transaction: TransactionWithRelations;
	categories: Category[];
	accounts: AccountSelectorProps[];
	settings: Setting;
}) {
	const [activeDialog, setActiveDialog] = useState<
		'INCOME' | 'EXPENSE' | 'TRANSFER' | null
	>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleDelete = async () => {
		startTransition(async () => {
			const res = await deleteTransaction(transaction.id);
			if (res && 'error' in res && res.error) {
				alert(res.error);
			}
			setShowDeleteConfirm(false);
		});
	};

	const handleEdit = () => {
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

	const transferInitialData = isTransfer
		? {
				amount: Math.abs(transaction.amount),
				name: transaction.name,
				fromAccountId: inflow ? '' : transaction.accountId,
				toAccountId: inflow ? transaction.accountId : '',
				date: new Date(transaction.date),
			}
		: undefined;

	const actions: ActionItem[] = [
		{
			label: 'Edit',
			icon: 'pencil',
			onClick: handleEdit,
		},
		{
			label: isPending ? 'Deleting...' : 'Delete',
			icon: 'trash',
			onClick: () => setShowDeleteConfirm(true),
			disabled: isPending,
			className: 'text-red-500 hover:bg-red-50 focus:bg-red-50',
		},
	];

	return (
		<>
			<ActionDropdown actions={actions} />

			<ConfirmDialog
				isOpen={showDeleteConfirm}
				onOpenChange={setShowDeleteConfirm}
				title="Delete Transaction"
				description="Are you sure you want to delete this transaction? This action cannot be undone."
				confirmText="Delete Transaction"
				onConfirm={handleDelete}
				variant="destroy"
				isPending={isPending}
			/>

			{(activeDialog === 'INCOME' || activeDialog === 'EXPENSE') && (
				<BaseTransactionDialog
					type={activeDialog}
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
					initialData={
						transferInitialData as {
							amount: number;
							name: string;
							fromAccountId: string;
							toAccountId: string;
							date: Date;
						}
					}
				/>
			)}
		</>
	);
}
