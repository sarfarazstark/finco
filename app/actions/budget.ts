'use server';

import {
	getServerUser,
	handleError,
	revalidateTransactions,
} from '@/lib/action-utils';
import { prisma } from '@/lib/prisma';
import { budgetSchema } from '@/lib/schema';
import { z } from 'zod/v4';

export type BudgetPayload = z.infer<typeof budgetSchema>;

export async function createBudget(data: BudgetPayload) {
	const user = await getServerUser();
	if (!user) return { error: 'Unauthorized' };

	try {
		const validatedFields = budgetSchema.safeParse(data);
		if (!validatedFields.success) return { error: 'Validation failed' };

		const validData = validatedFields.data;
		const numericAmount = Math.abs(validData.maximum);

		const budget = await prisma.budget.create({
			data: {
				userId: user.id,
				categoryId: validData.categoryId,
				maximum: numericAmount,
				type: validData.type,
				themeId: validData.themeId,
			},
		});

		await revalidateTransactions();
		return { success: true, budget };
	} catch (error) {
		return await handleError(error, 'Failed to create budget');
	}
}

export async function updateBudget(id: string, data: BudgetPayload) {
	const user = await getServerUser();
	if (!user) return { error: 'Unauthorized' };

	try {
		const validatedFields = budgetSchema.safeParse(data);
		if (!validatedFields.success) return { error: 'Validation failed' };

		const validData = validatedFields.data;
		const numericAmount = Math.abs(validData.maximum);

		const budget = await prisma.budget.update({
			where: { id },
			data: {
				userId: user.id,
				categoryId: validData.categoryId,
				maximum: numericAmount,
				type: validData.type,
				themeId: validData.themeId,
			},
		});

		await revalidateTransactions();
		return { success: true, budget };
	} catch (error) {
		return await handleError(error, 'Failed to update budget');
	}
}

export async function deleteBudget(id: string) {
	const user = await getServerUser();
	if (!user) return { error: 'Unauthorized' };

	try {
		const budget = await prisma.budget.delete({
			where: { id },
		});

		await revalidateTransactions();
		return { success: true, budget };
	} catch (error) {
		return await handleError(error, 'Failed to delete budget');
	}
}
