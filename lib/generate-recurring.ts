import { prisma } from '@/lib/prisma';

/**
 * On-visit auto-generation: checks all recurring transactions
 * and creates new ones for any that are due based on their frequency.
 */
export async function generateRecurringTransactions(userId: string) {
	const recurringTxs = await prisma.transaction.findMany({
		where: { userId, recurring: true },
		orderBy: { date: 'desc' },
	});

	// Solo procesar las que tengan frequency definido
	const withFrequency = recurringTxs.filter(tx => tx.frequency !== null);
	if (withFrequency.length === 0) return;

	const now = new Date();

	// Agrupar por nombre + cuenta para encontrar la última ocurrencia
	const latestByKey = new Map<string, (typeof withFrequency)[0]>();
	for (const tx of withFrequency) {
		const key = `${tx.name}::${tx.accountId}`;
		if (!latestByKey.has(key)) {
			latestByKey.set(key, tx);
		}
	}

	for (const [, template] of latestByKey) {
		if (!template.frequency) continue;

		const daysSinceLast =
			(now.getTime() - template.date.getTime()) / (1000 * 60 * 60 * 24);

		if (daysSinceLast < template.frequency) continue;

		await prisma.transaction.create({
			data: {
				userId,
				accountId: template.accountId,
				categoryId: template.categoryId,
				name: template.name,
				amount: template.amount,
				type: template.type,
				date: now,
				recurring: true,
				frequency: template.frequency,
			},
		});
	}
}
