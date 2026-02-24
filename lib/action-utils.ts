'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Consolidates server-side user retrieval and authorization check.
 */
export async function getServerUser() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	return session.user;
}

/**
 * Centralized revalidation for transaction-related pages.
 */
export async function revalidateTransactions() {
	revalidatePath('/');
	revalidatePath('/transactions');
	revalidatePath('/budget');
	revalidatePath('/pots');
}

/**
 * Calculates the signed amount based on transaction type.
 */
export async function getSignedAmount(
	amount: number,
	type: 'INCOME' | 'EXPENSE' | 'TRANSFER'
) {
	const numericAmount = Math.abs(amount);
	return type === 'EXPENSE' ? -numericAmount : numericAmount;
}

/**
 * Generic error handler for server actions.
 */
export async function handleError(error: unknown, fallbackMessage: string) {
	console.error(`${fallbackMessage}:`, error);
	const message = error instanceof Error ? error.message : fallbackMessage;
	return { error: message };
}
