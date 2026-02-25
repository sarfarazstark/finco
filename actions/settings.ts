'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { aj } from '@/lib/arcjet';
import { request } from '@arcjet/next';

export async function updateCurrency(currency: string) {
	const decision = await aj.protect(await request(), { requested: 1 });
	if (decision.isDenied())
		return { success: false, error: 'Rate limit exceeded' };
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return { success: false, error: 'Unauthorized' };
		}

		await prisma.setting.upsert({
			where: {
				userId: session.user.id,
			},
			update: {
				currency,
			},
			create: {
				userId: session.user.id,
				currency,
				theme: 'light',
			},
		});

		revalidatePath('/', 'layout');

		return { success: true };
	} catch (error) {
		console.error('Error updating currency:', error);
		return { success: false, error: 'Failed to update currency' };
	}
}
