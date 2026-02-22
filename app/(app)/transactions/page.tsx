import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Pagination } from '@/components/ui/pagination';
import { TransactionFilters } from './_components/transaction-filters';
import { AnimatedTableWrapper } from './_components/animated-table-wrapper';
import { getTransactionsPageData } from '@/lib/data/transactions';
import { ResolvedImage } from '@/components/transactions/resolved-image';
import { TransactionActions } from './_components/transaction-actions';
import { prisma } from '@/lib/prisma';

export default async function TransactionsPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const session =
		(await auth.api.getSession({
			headers: await headers(),
		})) ?? redirect('/auth/login');

	const { categories, accounts, transactions, meta } = await getTransactionsPageData(
		session.user.id,
		params
	);

	const dbSettings = await prisma.setting.findUnique({
		where: { userId: session.user.id }
	});

	const settings = {
		currency: dbSettings?.currency || 'INR',
		theme: dbSettings?.theme || 'light'
	};

	return (
		<section className="p-8 max-w-5xl mx-auto">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Transactions</h1>
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
									<th className="px-3 py-2 font-normal text-center w-12">
										<span className="sr-only">Actions</span>
									</th>
								</tr>
							</thead>
							<tbody>
								{transactions.map(tx => {
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
													<div className="w-10 h-10 rounded-full flex align-center justify-center overflow-hidden shrink-0 border border-grey-100">
														<ResolvedImage
															transaction={tx}
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
											<td className="px-3 py-4 flex justify-end">
												<TransactionActions
													transaction={tx}
													categories={categories}
													accounts={accounts}
													settings={settings}
												/>
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
