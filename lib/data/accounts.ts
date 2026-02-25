import { prisma } from '@/lib/prisma';

export type AccountWithBalance = {
	id: string;
	name: string;
	image: string;
	currency: string;
	balance: number;
};

export type DailyBalance = {
	date: string;
	balance: number;
};

export type DailyTransaction = {
	date: string;
	income: number;
	expense: number;
};

function computeDateRange(params: {
	period?: string;
	date?: string;
	from?: string;
	to?: string;
	month?: string;
	year?: string;
}): { dateFrom: Date; dateTo: Date } {
	const now = new Date();

	switch (params.period) {
		case 'daily': {
			const d = params.date ? new Date(params.date) : now;
			d.setHours(0, 0, 0, 0);
			const end = new Date(d);
			end.setHours(23, 59, 59, 999);
			return { dateFrom: d, dateTo: end };
		}
		case 'weekly': {
			const d = params.date ? new Date(params.date) : now;
			const day = d.getDay();
			const diff = d.getDate() - day + (day === 0 ? -6 : 1);
			const start = new Date(d);
			start.setDate(diff);
			start.setHours(0, 0, 0, 0);
			const end = new Date(start);
			end.setDate(end.getDate() + 6);
			end.setHours(23, 59, 59, 999);
			return { dateFrom: start, dateTo: end };
		}
		case 'monthly': {
			if (params.month) {
				const [y, m] = params.month.split('-').map(Number);
				const start = new Date(y, m - 1, 1);
				const end = new Date(y, m, 0, 23, 59, 59, 999);
				return { dateFrom: start, dateTo: end };
			}
			const start = new Date(now.getFullYear(), now.getMonth(), 1);
			const end = new Date(
				now.getFullYear(),
				now.getMonth() + 1,
				0,
				23,
				59,
				59,
				999
			);
			return { dateFrom: start, dateTo: end };
		}
		case 'yearly': {
			const y = params.year ? parseInt(params.year) : now.getFullYear();
			return {
				dateFrom: new Date(y, 0, 1),
				dateTo: new Date(y, 11, 31, 23, 59, 59, 999),
			};
		}
		case 'custom': {
			const from = params.from ? new Date(params.from) : now;
			from.setHours(0, 0, 0, 0);
			const to = params.to ? new Date(params.to) : from;
			to.setHours(23, 59, 59, 999);
			return { dateFrom: from, dateTo: to };
		}
		default: {
			const thirtyAgo = new Date();
			thirtyAgo.setDate(thirtyAgo.getDate() - 29);
			thirtyAgo.setHours(0, 0, 0, 0);
			return { dateFrom: thirtyAgo, dateTo: now };
		}
	}
}

export async function getAccountsPageData(
	userId: string,
	selectedAccountId?: string,
	filterParams?: {
		period?: string;
		date?: string;
		from?: string;
		to?: string;
		month?: string;
		year?: string;
	}
) {
	const accounts = await prisma.financialAccount.findMany({
		where: { userId },
		include: {
			transactions: {
				select: { amount: true },
			},
		},
		orderBy: { createdAt: 'desc' },
	});

	const accountsWithBalance: AccountWithBalance[] = accounts.map(account => ({
		id: account.id,
		name: account.name,
		image: account.image,
		currency: account.currency,
		balance: account.transactions.reduce((sum, tx) => sum + tx.amount, 0),
	}));

	const totalAssets = accountsWithBalance
		.filter(a => a.balance > 0)
		.reduce((sum, a) => sum + a.balance, 0);

	const totalLiabilities = accountsWithBalance
		.filter(a => a.balance < 0)
		.reduce((sum, a) => sum + Math.abs(a.balance), 0);

	const accountFilter = selectedAccountId
		? { accountId: selectedAccountId }
		: {};

	const { dateFrom, dateTo } = computeDateRange(filterParams || {});

	const rangeTransactions = await prisma.transaction.findMany({
		where: {
			userId,
			date: { gte: dateFrom, lte: dateTo },
			...accountFilter,
		},
		select: { amount: true, date: true, type: true },
		orderBy: { date: 'asc' },
	});

	const priorBalance = await prisma.transaction.aggregate({
		where: {
			userId,
			date: { lt: dateFrom },
			...accountFilter,
		},
		_sum: { amount: true },
	});

	let runningBalance = priorBalance._sum.amount || 0;

	const totalDays = Math.max(
		1,
		Math.ceil(
			(dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)
		) + 1
	);

	const dailyBalanceMap = new Map<string, number>();
	const dailyTxMap = new Map<string, { income: number; expense: number }>();

	for (let i = 0; i < totalDays; i++) {
		const d = new Date(dateFrom);
		d.setDate(d.getDate() + i);
		const key = d.toISOString().split('T')[0];
		dailyBalanceMap.set(key, runningBalance);
		dailyTxMap.set(key, { income: 0, expense: 0 });
	}

	for (const tx of rangeTransactions) {
		const key = new Date(tx.date).toISOString().split('T')[0];
		runningBalance += tx.amount;
		let found = false;
		for (const [dKey] of dailyBalanceMap) {
			if (dKey === key) found = true;
			if (found) dailyBalanceMap.set(dKey, runningBalance);
		}
		const entry = dailyTxMap.get(key);
		if (entry) {
			if (tx.type === 'INCOME') {
				entry.income += tx.amount;
			} else if (tx.type === 'EXPENSE') {
				entry.expense += Math.abs(tx.amount);
			}
		}
	}

	const dailyBalances: DailyBalance[] = Array.from(
		dailyBalanceMap.entries()
	).map(([date, balance]) => ({ date, balance }));

	const dailyTransactions: DailyTransaction[] = Array.from(
		dailyTxMap.entries()
	).map(([date, data]) => ({
		date,
		income: data.income,
		expense: data.expense,
	}));

	return {
		accounts: accountsWithBalance,
		totalAssets,
		totalLiabilities,
		dailyBalances,
		dailyTransactions,
	};
}
