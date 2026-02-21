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
