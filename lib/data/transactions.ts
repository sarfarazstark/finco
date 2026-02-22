import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { paginate } from '@/lib/pagination';

const SORT_MAP: Record<string, Prisma.TransactionOrderByWithRelationInput> = {
	latest: { date: 'desc' },
	oldest: { date: 'asc' },
	atoz: { name: 'asc' },
	ztoa: { name: 'desc' },
	highest: { amount: 'desc' },
	lowest: { amount: 'asc' },
};

export async function getTransactionsPageData(
	userId: string,
	searchParams: { [key: string]: string | string[] | undefined }
) {
	const page = parseInt(searchParams.page as string, 10);
	const search = (searchParams.search as string) || '';
	const sort = (searchParams.sort as string) || 'latest';
	const category = (searchParams.category as string) || '';
	const accountId = (searchParams.accountId as string) || '';
	const currentPage = isNaN(page) || page < 1 ? 1 : page;

	const [dbCategories, dbAccounts, { data: transactions, meta }] =
		await Promise.all([
			prisma.category.findMany({
				where: { userId },
				include: { icon: true },
				orderBy: { name: 'asc' },
			}),
			prisma.financialAccount.findMany({
				where: { userId },
				include: {
					transactions: {
						select: { amount: true },
					},
				},
			}),
			paginate(
				prisma.transaction,
				{
					where: {
						userId,
						...(category && category !== 'All'
							? { category: { name: category } }
							: {}),
						...(accountId && accountId !== 'All'
							? { accountId }
							: {}),
						...(search
							? {
									name: {
										contains: search,
										mode: 'insensitive',
									},
								}
							: {}),
					},
					include: {
						category: { include: { icon: true } },
						account: true,
					},
					orderBy: SORT_MAP[sort] ?? { date: 'desc' },
				},
				currentPage,
				10
			),
		]);

	const categories = dbCategories.map(c => ({
		id: c.id,
		name: c.name,
		icon: c.icon?.name || 'category',
		color: c.icon
			? `${c.icon.bg} ${c.icon.color}`
			: 'bg-grey-100 text-grey-600',
	}));

	const accounts = dbAccounts.map(a => ({
		id: a.id,
		name: a.name,
		icon: a.image || 'wallet',
		balance: a.transactions.reduce((sum, t) => sum + t.amount, 0),
	}));

	return {
		categories,
		accounts,
		transactions: transactions as Prisma.TransactionGetPayload<{
			include: {
				category: { include: { icon: true } };
				account: true;
			};
		}>[],
		meta,
	};
}
