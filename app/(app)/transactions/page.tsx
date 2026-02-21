import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { resolveTransactionImage } from '@/lib/resolve-transaction-image';
import { Pagination } from '@/components/ui/pagination';
import { paginate } from '@/lib/pagination';
import { TransactionFilters } from './_components/transaction-filters';
import { AnimatedTableWrapper } from './_components/animated-table-wrapper';
import { AddTransactionDialog } from './_components/add-transaction-dialog';

export default async function TransactionsPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const page =
		typeof params.page === 'string' ? parseInt(params.page, 10) : 1;
	const currentPage = isNaN(page) || page < 1 ? 1 : page;

	const search = typeof params.search === 'string' ? params.search : '';
	const sort = typeof params.sort === 'string' ? params.sort : 'latest';
	const category = typeof params.category === 'string' ? params.category : '';

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect('/auth/login');
	}

	const categories = await prisma.category.findMany({
		where: { userId: session.user.id },
		select: { name: true },
		orderBy: { name: 'asc' },
	});

	const sortMap: Record<string, object> = {
		latest: { date: 'desc' },
		oldest: { date: 'asc' },
		atoz: { name: 'asc' },
		ztoa: { name: 'desc' },
		highest: { amount: 'desc' },
		lowest: { amount: 'asc' },
	};

	const { data, meta } = await paginate(
		prisma.transaction,
		{
			where: {
				userId: session.user.id,
				...(category && category !== 'All'
					? { category: { name: category } }
					: {}),
				...(search
					? { name: { contains: search, mode: 'insensitive' } }
					: {}),
			},
			include: { category: true, account: true },
			orderBy: sortMap[sort] || { date: 'desc' },
		},
		currentPage,
		10
	);

	const transactions = data as Prisma.TransactionGetPayload<{
		include: { category: true; account: true };
	}>[];

	return (
		<section className="p-8 max-w-5xl mx-auto">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Transactions</h1>
				<AddTransactionDialog />
			</header>

			<div className="bg-white p-6 rounded-xl space-y-6">
				<TransactionFilters categories={categories.map(c => c.name)} />
				<AnimatedTableWrapper>
					<div className="w-full overflow-x-auto">
						<table className="table-auto w-full min-w-175">
							<thead>
								<tr className="text-left font-preset-5 border-b border-grey-100 text-grey-500">
									<th className="px-3 py-2 font-normal">
										Receipt / Sender
									</th>
									<th className="px-3 py-2 font-normal">
										Category
									</th>
									<th className="px-3 py-2 font-normal">
										Transaction Date
									</th>
									<th className="px-3 py-2 font-normal text-right">
										Amount
									</th>
								</tr>
							</thead>
							<tbody>
								{transactions.map(tx => {
									const imageSrc =
										resolveTransactionImage(tx);
									const isPositive = tx.type === 'INCOME';
									const sign = isPositive ? '+' : '-';

									const categoryName =
										tx.category?.name ?? 'General';

									return (
										<tr
											key={tx.id}
											className="text-left font-preset-5 text-grey-500 border-b border-grey-100/50 last:border-b-0"
										>
											<td className="px-3 py-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-grey-100">
														<Image
															src={imageSrc}
															alt={tx.name}
															width={40}
															height={40}
															className="w-full h-full object-cover"
														/>
													</div>
													<p className="font-preset-4-bold text-sm text-grey-900">
														{tx.name}
													</p>
												</div>
											</td>
											<td className="px-3 py-4">
												{categoryName}
											</td>
											<td className="px-3 py-4">
												{new Date(
													tx.date
												).toLocaleDateString('en-GB', {
													day: '2-digit',
													month: 'short',
													year: 'numeric',
												})}
											</td>
											<td
												className={`px-3 py-4 text-right font-preset-4-bold ${
													isPositive
														? 'text-green'
														: 'text-grey-900'
												}`}
											>
												{sign}₹
												{Math.abs(tx.amount).toFixed(2)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</AnimatedTableWrapper>

				<Pagination
					totalPages={meta.lastPage}
					currentPage={meta.currentPage}
				/>
			</div>
		</section>
	);
}
