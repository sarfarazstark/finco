'use server';
import {
	getServerUser,
	revalidateTransactions,
	handleError,
} from '@/lib/action-utils';
import { prisma } from '@/lib/prisma';
import { potSchema } from '@/lib/schema';
import { z } from 'zod/v4';

export const getAllPots = async ({ userId }: { userId: string }) => {
	try {
		const pots = await prisma.pot.findMany({
			where: { userId },
			include: { theme: true },
		});
		return { data: pots };
	} catch (error) {
		return handleError(error, 'Failed to fetch pots');
	}
};

export const createPot = async (data: z.infer<typeof potSchema>) => {
	try {
		const user = await getServerUser();
		if (!user) return { error: 'Unauthorized' };
		const pot = await prisma.pot.create({
			data: {
				...data,
				userId: user.id,
			},
		});
		revalidateTransactions();
		return { data: pot };
	} catch (error) {
		return handleError(error, 'Failed to create pot');
	}
};

export const updatePot = async (data: z.infer<typeof potSchema>) => {
	try {
		const user = await getServerUser();
		if (!user) return { error: 'Unauthorized' };
		const pot = await prisma.pot.update({
			where: { id: data.id },
			data: {
				...data,
				userId: user.id,
			},
		});
		revalidateTransactions();
		return { data: pot };
	} catch (error) {
		return handleError(error, 'Failed to update pot');
	}
};

export const deletePot = async ({ id }: { id: string }) => {
	try {
		const user = await getServerUser();
		if (!user) return { error: 'Unauthorized' };
		const pot = await prisma.pot.delete({
			where: { id },
		});
		revalidateTransactions();
		return { data: pot };
	} catch (error) {
		return handleError(error, 'Failed to delete pot');
	}
};
