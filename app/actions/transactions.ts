'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { transactionSchema } from '@/lib/schema';
import { z } from 'zod/v4';

export type TransactionPayload = z.infer<typeof transactionSchema>;

export async function addTransaction(data: TransactionPayload) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return { error: 'Unauthorized' };
	}

	try {
		// Temporary robust fallback: if UI sends dummy 'cash' or undefined, bind to a real DB account
		let targetAccountId = data.accountId;
		if (
			!targetAccountId ||
			targetAccountId === 'cash' ||
			targetAccountId === 'bank' ||
			targetAccountId === 'card'
		) {
			let defaultAccount = await prisma.financialAccount.findFirst({
				where: { userId: session.user.id },
			});

			if (!defaultAccount) {
				defaultAccount = await prisma.financialAccount.create({
					data: {
						userId: session.user.id,
						name: 'Main Account',
						image: 'wallet',
						currency: 'INR',
					},
				});
			}
			targetAccountId = defaultAccount.id;
		}

		const validatedFields = transactionSchema.safeParse(data);

		if (!validatedFields.success) {
			return {
				error: 'Validation failed',
				details: validatedFields.error.flatten().fieldErrors,
			};
		}

		const validData = validatedFields.data;

		const numericAmount = Math.abs(validData.amount);

		if (validData.type === 'TRANSFER' && validData.toAccountId) {
			// Generate a shared ID to link the two sides of the transfer
			const sharedTransferId = crypto.randomUUID();

			const [outTx] = await prisma.$transaction([
				prisma.transaction.create({
					data: {
						userId: session.user.id,
						accountId: targetAccountId,
						name: validData.name,
						amount: -numericAmount, // Outflow
						type: 'TRANSFER',
						date: new Date(validData.date),
						recurring: validData.recurring || false,
						transferId: sharedTransferId,
					},
				}),
				prisma.transaction.create({
					data: {
						userId: session.user.id,
						accountId: validData.toAccountId,
						name: validData.name,
						amount: numericAmount, // Inflow
						type: 'TRANSFER',
						date: new Date(validData.date),
						recurring: validData.recurring || false,
						transferId: sharedTransferId,
					},
				}),
			]);

			revalidatePath('/');
			revalidatePath('/transactions');
			return { success: true, transaction: outTx };
		}

		// Regular INCOME or EXPENSE
		const transaction = await prisma.transaction.create({
			data: {
				userId: session.user.id,
				accountId: targetAccountId,
				categoryId: validData.categoryId,
				name: validData.name,
				amount:
					validData.type === 'EXPENSE'
						? -numericAmount
						: numericAmount,
				type: validData.type,
				date: new Date(validData.date),
				recurring: validData.recurring || false,
			},
		});

		revalidatePath('/');
		revalidatePath('/transactions');

		return { success: true, transaction };
	} catch (error: unknown) {
		console.error('Failed to add transaction:', error);
		const message =
			error instanceof Error
				? error.message
				: 'Failed to save transaction';
		return { error: message };
	}
}

export async function updateTransaction(id: string, data: TransactionPayload) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return { error: 'Unauthorized' };
	}

	try {
		const existingTx = await prisma.transaction.findUnique({
			where: { id },
		});

		if (!existingTx || existingTx.userId !== session.user.id) {
			return { error: 'Not found or unauthorized' };
		}

		// Ensure we are not attempting to update a Transfer as an Income/Expense, or vice versa, without deeper logic.
		// For simplicity in this iteration, we enforce type consistency (a Transfer remains a Transfer).
		if (existingTx.type !== data.type) {
			return { error: 'Cannot change transaction type' };
		}

		const validatedFields = transactionSchema.safeParse(data);
		if (!validatedFields.success) {
			return {
				error: 'Validation failed',
				details: validatedFields.error.flatten().fieldErrors,
			};
		}

		const validData = validatedFields.data;
		const numericAmount = Math.abs(validData.amount);

		if (
			validData.type === 'TRANSFER' &&
			validData.toAccountId &&
			existingTx.transferId
		) {
			// Find both sides of the transfer
			const relatedTransfers = await prisma.transaction.findMany({
				where: { transferId: existingTx.transferId },
			});

			if (relatedTransfers.length !== 2) {
				return { error: 'Corrupted transfer data' };
			}

			// We need to identify which is the outflow (amount < 0) and inflow (amount > 0) OR rely on the form data.
			// Since the UI passes fromAccount and toAccount exactly as they should be, we can just delete the old ones
			// and recreate them with the new data, keeping the same transferId. This is the cleanest way
			// to handle modifications to from/to accounts.

			await prisma.transaction.deleteMany({
				where: { transferId: existingTx.transferId },
			});

			await prisma.$transaction([
				prisma.transaction.create({
					data: {
						userId: session.user.id,
						accountId: validData.accountId,
						name: validData.name,
						amount: -numericAmount, // Outflow
						type: 'TRANSFER',
						date: new Date(validData.date),
						recurring: validData.recurring || false,
						transferId: existingTx.transferId,
					},
				}),
				prisma.transaction.create({
					data: {
						userId: session.user.id,
						accountId: validData.toAccountId,
						name: validData.name,
						amount: numericAmount, // Inflow
						type: 'TRANSFER',
						date: new Date(validData.date),
						recurring: validData.recurring || false,
						transferId: existingTx.transferId,
					},
				}),
			]);
		} else {
			// Regular INCOME or EXPENSE
			await prisma.transaction.update({
				where: { id },
				data: {
					accountId: validData.accountId,
					categoryId: validData.categoryId,
					name: validData.name,
					amount:
						validData.type === 'EXPENSE'
							? -numericAmount
							: numericAmount,
					date: new Date(validData.date),
					recurring: validData.recurring || false,
				},
			});
		}

		revalidatePath('/');
		revalidatePath('/transactions');
		return { success: true };
	} catch (error: unknown) {
		console.error('Failed to update transaction:', error);
		const message =
			error instanceof Error
				? error.message
				: 'Failed to update transaction';
		return { error: message };
	}
}

export async function deleteTransaction(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return { error: 'Unauthorized' };
	}

	try {
		const tx = await prisma.transaction.findUnique({ where: { id } });
		if (!tx || tx.userId !== session.user.id) {
			return { error: 'Not found or unauthorized' };
		}

		if (tx.transferId) {
			await prisma.transaction.deleteMany({
				where: { transferId: tx.transferId, userId: session.user.id },
			});
		} else {
			await prisma.transaction.delete({
				where: { id },
			});
		}

		revalidatePath('/');
		revalidatePath('/transactions');
		return { success: true };
	} catch (error: unknown) {
		console.error('Failed to delete transaction:', error);
		return { error: 'Failed to delete transaction' };
	}
}
