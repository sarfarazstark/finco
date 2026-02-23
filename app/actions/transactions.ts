'use server';

import { prisma } from '@/lib/prisma';
import { transactionSchema } from '@/lib/schema';
import { z } from 'zod/v4';
import {
	getServerUser,
	revalidateTransactions,
	getSignedAmount,
	handleError,
} from '@/lib/action-utils';

export type TransactionPayload = z.infer<typeof transactionSchema>;

export async function addTransaction(data: TransactionPayload) {
	const user = await getServerUser();
	if (!user) return { error: 'Unauthorized' };

	try {
		const validatedFields = transactionSchema.safeParse(data);
		if (!validatedFields.success) return { error: 'Validation failed' };

		const validData = validatedFields.data;
		const numericAmount = Math.abs(validData.amount);

		if (validData.type === 'TRANSFER' && validData.toAccountId) {
			const sharedTransferId = crypto.randomUUID();

			const [outTx] = await prisma.$transaction([
				prisma.transaction.create({
					data: {
						userId: user.id,
						accountId: validData.accountId,
						name: validData.name,
						amount: -numericAmount,
						type: 'TRANSFER',
						date: new Date(validData.date),
						recurring: validData.recurring || false,
						transferId: sharedTransferId,
					},
				}),
				prisma.transaction.create({
					data: {
						userId: user.id,
						accountId: validData.toAccountId,
						name: validData.name,
						amount: numericAmount,
						type: 'TRANSFER',
						date: new Date(validData.date),
						recurring: validData.recurring || false,
						transferId: sharedTransferId,
					},
				}),
			]);

			await revalidateTransactions();
			return { success: true, transaction: outTx };
		}

		const transaction = await prisma.transaction.create({
			data: {
				userId: user.id,
				accountId: validData.accountId,
				categoryId: validData.categoryId,
				name: validData.name,
				amount: await getSignedAmount(validData.amount, validData.type),
				type: validData.type,
				date: new Date(validData.date),
				recurring: validData.recurring || false,
			},
		});

		await revalidateTransactions();
		return { success: true, transaction };
	} catch (error) {
		return await handleError(error, 'Failed to add transaction');
	}
}

export async function updateTransaction(id: string, data: TransactionPayload) {
	const user = await getServerUser();
	if (!user) return { error: 'Unauthorized' };

	try {
		const existingTx = await prisma.transaction.findUnique({
			where: { id },
		});
		if (!existingTx || existingTx.userId !== user.id)
			return { error: 'Not found' };

		const validatedFields = transactionSchema.safeParse(data);
		if (!validatedFields.success) return { error: 'Validation failed' };

		const validData = validatedFields.data;
		const numericAmount = Math.abs(validData.amount);

		if (
			validData.type === 'TRANSFER' &&
			validData.toAccountId &&
			existingTx.transferId
		) {
			await prisma.transaction.deleteMany({
				where: { transferId: existingTx.transferId },
			});

			await prisma.$transaction([
				prisma.transaction.create({
					data: {
						userId: user.id,
						accountId: validData.accountId,
						name: validData.name,
						amount: -numericAmount,
						type: 'TRANSFER',
						date: new Date(validData.date),
						recurring: validData.recurring || false,
						transferId: existingTx.transferId,
					},
				}),
				prisma.transaction.create({
					data: {
						userId: user.id,
						accountId: validData.toAccountId,
						name: validData.name,
						amount: numericAmount,
						type: 'TRANSFER',
						date: new Date(validData.date),
						recurring: validData.recurring || false,
						transferId: existingTx.transferId,
					},
				}),
			]);
		} else {
			await prisma.transaction.update({
				where: { id },
				data: {
					accountId: validData.accountId,
					categoryId: validData.categoryId,
					name: validData.name,
					amount: await getSignedAmount(
						validData.amount,
						validData.type
					),
					date: new Date(validData.date),
					recurring: validData.recurring || false,
				},
			});
		}

		await revalidateTransactions();
		return { success: true };
	} catch (error) {
		return await handleError(error, 'Failed to update transaction');
	}
}

export async function deleteTransaction(id: string) {
	const user = await getServerUser();
	if (!user) return { error: 'Unauthorized' };

	try {
		const tx = await prisma.transaction.findUnique({ where: { id } });
		if (!tx || tx.userId !== user.id) return { error: 'Not found' };

		if (tx.transferId) {
			await prisma.transaction.deleteMany({
				where: { transferId: tx.transferId, userId: user.id },
			});
		} else {
			await prisma.transaction.delete({ where: { id } });
		}

		await revalidateTransactions();
		return { success: true };
	} catch (error) {
		return await handleError(error, 'Failed to delete transaction');
	}
}
