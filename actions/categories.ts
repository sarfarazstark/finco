'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { aj } from '@/lib/arcjet';
import { request } from '@arcjet/next';

export async function createCategory(data: { name: string; iconId: string }) {
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

		if (!data.name || !data.iconId) {
			return { success: false, error: 'Name and icon are required' };
		}

		const category = await prisma.category.create({
			data: {
				name: data.name,
				iconId: data.iconId,
				userId: session.user.id,
			},
			include: {
				icon: true,
			},
		});

		revalidatePath('/', 'layout');

		return { success: true, data: category };
	} catch (error) {
		console.error('Error creating category:', error);
		return { success: false, error: 'Failed to create category' };
	}
}
