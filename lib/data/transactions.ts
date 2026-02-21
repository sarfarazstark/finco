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
	const currentPage = isNaN(page) || page < 1 ? 1 : page;

	const [categories, { data: transactions, meta }] = await Promise.all([
		prisma.category.findMany({
			where: { userId },
			select: { name: true },
			orderBy: { name: 'asc' },
		}),
		paginate(
			prisma.transaction,
			{
				where: {
					userId,
					...(category && category !== 'All'
						? { category: { name: category } }
						: {}),
					...(search
						? { name: { contains: search, mode: 'insensitive' } }
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

	return {
		categories,
		transactions: transactions as Prisma.TransactionGetPayload<{
			include: {
				category: { include: { icon: true } };
				account: true;
			};
		}>[],
		meta,
	};
}
