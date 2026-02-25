'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createAccount(data: { name: string; image: string }) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return { success: false, error: 'Unauthorized' };
		}

		if (!data.name) {
			return { success: false, error: 'Account name is required' };
		}

		const account = await prisma.financialAccount.create({
			data: {
				name: data.name,
				image: data.image || '/assets/images/avatars/default.jpg',
				userId: session.user.id,
			},
		});

		revalidatePath('/', 'layout');

		return { success: true, data: account };
	} catch (error) {
		console.error({ error }, 'Failed to create account');
		return { success: false, error: 'Failed to create account' };
	}
}

export async function deleteAccount(id: string) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return { success: false, error: 'Unauthorized' };
		}

		// Verificar que la cuenta pertenece al usuario
		const account = await prisma.financialAccount.findFirst({
			where: { id, userId: session.user.id },
		});

		if (!account) {
			return { success: false, error: 'Account not found' };
		}

		await prisma.financialAccount.delete({
			where: { id },
		});

		revalidatePath('/', 'layout');

		return { success: true };
	} catch (error) {
		console.error({ error }, 'Failed to delete account');
		return { success: false, error: 'Failed to delete account' };
	}
}
