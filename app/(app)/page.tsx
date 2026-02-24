import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getSetting } from '@/hooks/use-setting';
import { OverviewSummaryCards } from './_components/overview-summary-cards';
import { OverviewPotsWidget } from './_components/overview-pots-widget';
import { OverviewBudgetsWidget } from './_components/overview-budgets-widget';
import { OverviewTransactionsWidget } from './_components/overview-transactions-widget';
import { OverviewRecurringBillsWidget } from './_components/overview-recurring-bills-widget';
import { isInCurrentPeriod, checkDueSoon } from '@/lib/recurring';
import type { BillStatus } from './recurring-bills/_components/bill-row';

export default async function Overview() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) return redirect('/auth/login');
	const userId = session.user.id;

	// Fetch all necessary data in parallel
	const [transactions, pots, budgets, settings] = await Promise.all([
		prisma.transaction.findMany({
			where: { userId },
			orderBy: { date: 'desc' },
			include: { account: true, category: { include: { icon: true } } },
		}),
		prisma.pot.findMany({
			where: { userId },
			include: { theme: true },
			orderBy: { total: 'desc' },
		}),
		prisma.budget.findMany({
			where: { userId },
			include: { category: true, theme: true },
		}),
		getSetting(userId),
	]);

	// 1. Calculate Summary Cards
	const balance = transactions.reduce((sum, tx) => sum + tx.amount, 0);
	const income = transactions
		.filter(
			tx =>
				tx.type === 'INCOME' ||
				(tx.amount >= 0 && tx.type !== 'EXPENSE')
		)
		.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
	const expenses = transactions
		.filter(tx => tx.type === 'EXPENSE' || tx.amount < 0)
		.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

	// 2. Process Recurring Bills
	const allRecurring = transactions.filter(tx => tx.recurring);
	const latestByKey = new Map<string, (typeof allRecurring)[0]>();

	for (const tx of allRecurring) {
		const key = `${tx.name}::${tx.accountId}`;
		if (!latestByKey.has(key)) {
			latestByKey.set(key, tx);
		}
	}
	const uniqueBills = Array.from(latestByKey.values());

	const statusMap: Record<string, BillStatus> = {};
	const now = new Date();

	for (const bill of uniqueBills) {
		const frequency = bill.frequency;
		const allMatching = allRecurring.filter(
			tx => tx.name === bill.name && tx.accountId === bill.accountId
		);

		const hasTxInPeriod = allMatching.some(tx =>
			isInCurrentPeriod(tx.date, frequency, now)
		);

		if (hasTxInPeriod) {
			statusMap[bill.id] = 'paid';
		} else {
			const isDueSoon = checkDueSoon(bill.date, frequency, now);
			statusMap[bill.id] = isDueSoon ? 'due-soon' : 'upcoming';
		}
	}

	return (
		<div className="p-8 max-w-6xl mx-auto flex flex-col gap-6">
			<header className="flex items-center justify-between">
				<h1 className="text-3xl font-bold text-grey-900">Overview</h1>
			</header>

			<OverviewSummaryCards
				balance={balance}
				income={income}
				expenses={expenses}
				currency={settings.currency}
			/>

			<div className="flex flex-col lg:flex-row gap-6">
				<div className="flex-5 flex flex-col gap-6">
					<OverviewPotsWidget
						pots={pots}
						currency={settings.currency}
					/>
					<OverviewTransactionsWidget
						transactions={transactions}
						currency={settings.currency}
					/>
				</div>

				<div className="flex-2 flex flex-col gap-6">
					<OverviewBudgetsWidget
						budgets={budgets}
						transactions={transactions}
						currency={settings.currency}
					/>
					<OverviewRecurringBillsWidget
						bills={uniqueBills}
						statusMap={statusMap}
						currency={settings.currency}
					/>
				</div>
			</div>
		</div>
	);
}
