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

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id: _id, ...potData } = data;

		const pot = await prisma.pot.create({
			data: {
				...potData,
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

		if (!data.id) return { error: 'Pot ID is required' };

		const { id, ...potData } = data;

		const pot = await prisma.pot.update({
			where: { id },
			data: potData,
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

/**
 * Añade dinero a un pot. No puede exceder el target.
 */
export const addToPot = async ({
	potId,
	amount,
}: {
	potId: string;
	amount: number;
}) => {
	try {
		const user = await getServerUser();
		if (!user) return { error: 'Unauthorized' };

		const pot = await prisma.pot.findUnique({ where: { id: potId } });
		if (!pot) return { error: 'Pot not found' };
		if (pot.userId !== user.id) return { error: 'Unauthorized' };

		const newTotal = Math.min(pot.total + amount, pot.target);

		const updated = await prisma.pot.update({
			where: { id: potId },
			data: { total: newTotal },
		});

		revalidateTransactions();
		return { data: updated };
	} catch (error) {
		return handleError(error, 'Failed to add to pot');
	}
};

/**
 * Retira dinero de un pot. No puede bajar de 0.
 */
export const withdrawFromPot = async ({
	potId,
	amount,
}: {
	potId: string;
	amount: number;
}) => {
	try {
		const user = await getServerUser();
		if (!user) return { error: 'Unauthorized' };

		const pot = await prisma.pot.findUnique({ where: { id: potId } });
		if (!pot) return { error: 'Pot not found' };
		if (pot.userId !== user.id) return { error: 'Unauthorized' };

		const newTotal = Math.max(pot.total - amount, 0);

		const updated = await prisma.pot.update({
			where: { id: potId },
			data: { total: newTotal },
		});

		revalidateTransactions();
		return { data: updated };
	} catch (error) {
		return handleError(error, 'Failed to withdraw from pot');
	}
};
