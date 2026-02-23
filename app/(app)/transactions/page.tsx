import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Pagination } from '@/components/ui/pagination';
import { TransactionFilters } from './_components/transaction-filters';
import { AccountFilter } from './_components/account-filter';
import { AnimatedTableWrapper } from './_components/animated-table-wrapper';
import { getTransactionsPageData } from '@/lib/data/transactions';
import { TransactionRow } from './_components/transaction-row';
import { getSetting } from '@/hooks/use-setting';

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

	const { categories, accounts, transactions, meta } =
		await getTransactionsPageData(session.user.id, params);

	const settings = await getSetting(session.user.id);

	return (
		<section className="p-8 max-w-5xl mx-auto">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Transactions</h1>
				<AccountFilter
					accounts={accounts}
					currency={settings.currency}
				/>
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
								{transactions.map(tx => (
									<TransactionRow
										key={tx.id}
										transaction={tx}
										categories={categories}
										accounts={accounts}
										settings={settings}
									/>
								))}
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
