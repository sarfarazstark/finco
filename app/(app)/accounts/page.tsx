import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAccountsPageData } from '@/lib/data/accounts';
import { getTransactionsPageData } from '@/lib/data/transactions';
import { getSetting } from '@/hooks/use-setting';

import { AccountDropdownFilter } from './_components/account-dropdown-filter';
import { CreateAccountDialog } from './_components/create-account-dialog';
import { BalanceLineChart } from './_components/balance-line-chart';
import { IncomeExpenseChart } from './_components/income-expense-chart';
import { DateFilterToolbar } from './_components/date-filter-toolbar';
import { AnimatedTableWrapper } from '../transactions/_components/animated-table-wrapper';
import { TransactionRow } from '../transactions/_components/transaction-row';
import { Pagination } from '@/components/ui/pagination';
import { IconGhostOff } from '@tabler/icons-react';

export default async function AccountsPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const session =
		(await auth.api.getSession({
			headers: await headers(),
		})) ?? redirect('/auth/login');

	const selectedAccountId = (params.accountId as string) || '';

	const filterParams = {
		period: (params.period as string) || undefined,
		date: (params.date as string) || undefined,
		from: (params.from as string) || undefined,
		to: (params.to as string) || undefined,
		month: (params.month as string) || undefined,
		year: (params.year as string) || undefined,
	};

	const [accountsData, txData, settings] = await Promise.all([
		getAccountsPageData(
			session.user.id,
			selectedAccountId || undefined,
			filterParams
		),
		getTransactionsPageData(session.user.id, params),
		getSetting(session.user.id),
	]);

	const { accounts, dailyTransactions } = accountsData;

	const { categories, accounts: txAccounts, transactions, meta } = txData;

	return (
		<section className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
			<header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<h1 className="text-3xl font-bold text-grey-900">Accounts</h1>
					<AccountDropdownFilter
						accounts={accounts}
						selectedAccountId={selectedAccountId}
						currency={settings.currency}
					/>
				</div>
				<div className="flex items-center gap-4 relative z-50">
					<DateFilterToolbar />
					<CreateAccountDialog />
				</div>
			</header>

			<div className="flex flex-col gap-6">
				<div className="flex gap-6 h-75">
					<BalanceLineChart data={dailyTransactions} className="flex-1" />
					<IncomeExpenseChart data={dailyTransactions} className="flex-3" />
				</div>

				<div className="bg-white p-4 rounded-2xl min-h-125">
					<AnimatedTableWrapper>
						<div className="w-full overflow-x-auto">
							<table className="table-auto w-full text-sm">
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
											<span className="sr-only">
												Actions
											</span>
										</th>
									</tr>
								</thead>
								<tbody>
									{transactions.length > 0 ? (
										transactions.map(tx => (
											<TransactionRow
												key={tx.id}
												transaction={tx}
												categories={categories}
												accounts={txAccounts}
												settings={settings}
											/>
										))
									) : (
										<tr>
											<td
												colSpan={5}
												className="text-center py-20"
											>
												<div className="flex flex-col items-center justify-center">
													<div className="w-16 h-16 bg-grey-50 rounded-full flex items-center justify-center mb-4">
														<span className="text-2xl">
																<IconGhostOff className="w-3.5 h-3.5" />
														</span>
													</div>
													<p className="font-bold text-grey-900 mb-1 text-base">
														No transactions found
													</p>
													<p className="text-sm text-grey-500 max-w-62.5">
														{selectedAccountId
															? 'This account has no transactions for the selected period.'
															: 'Select an account or adjust the date filter to see your activity.'}
													</p>
												</div>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</AnimatedTableWrapper>

					{transactions.length > 0 && (
						<div className="mt-6 border-t border-grey-100 pt-6">
							<Pagination
								totalPages={meta.lastPage}
								currentPage={meta.currentPage}
							/>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
