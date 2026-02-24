import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getSetting } from '@/hooks/use-setting';
import { BillsSummary } from './_components/bills-summary';
import { BillsTable } from './_components/bills-table';
import type { BillStatus } from './_components/bill-row';

export default async function RecurringBillsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) return redirect('/auth/login');

	const allRecurring = await prisma.transaction.findMany({
		where: { userId: session.user.id, recurring: true },
		include: {
			category: { include: { icon: true } },
			account: true,
		},
		orderBy: { date: 'desc' },
	});

	const settings = await getSetting(session.user.id);
	const now = new Date();

	const latestByKey = new Map<string, (typeof allRecurring)[0]>();
	for (const tx of allRecurring) {
		const key = `${tx.name}::${tx.accountId}`;
		if (!latestByKey.has(key)) {
			latestByKey.set(key, tx);
		}
	}
	const uniqueBills = Array.from(latestByKey.values());

	const statusMap = new Map<string, BillStatus>();

	for (const bill of uniqueBills) {
		const key = bill.id;
		const frequency = bill.frequency;

		const allMatching = allRecurring.filter(
			tx => tx.name === bill.name && tx.accountId === bill.accountId
		);

		const hasTxInPeriod = allMatching.some(tx =>
			isInCurrentPeriod(tx.date, frequency, now)
		);

		if (hasTxInPeriod) {
			statusMap.set(key, 'paid');
		} else {
			const isDueSoon = checkDueSoon(bill.date, frequency, now);
			statusMap.set(key, isDueSoon ? 'due-soon' : 'upcoming');
		}
	}

	let paidCount = 0;
	let paidAmount = 0;
	let upcomingCount = 0;
	let upcomingAmount = 0;
	let dueSoonCount = 0;
	let dueSoonAmount = 0;

	for (const bill of uniqueBills) {
		const status = statusMap.get(bill.id) || 'upcoming';
		const amount = Math.abs(bill.amount);

		switch (status) {
			case 'paid':
				paidCount++;
				paidAmount += amount;
				break;
			case 'due-soon':
				dueSoonCount++;
				dueSoonAmount += amount;
				break;
			default:
				upcomingCount++;
				upcomingAmount += amount;
		}
	}

	const totalAmount = uniqueBills.reduce(
		(sum, b) => sum + Math.abs(b.amount),
		0
	);

	const statusRecord: Record<string, BillStatus> = {};
	for (const [id, status] of statusMap) {
		statusRecord[id] = status;
	}

	return (
		<div className="p-8 max-w-6xl mx-auto">
			<header className="mb-8">
				<h1 className="text-3xl font-bold">Recurring Bills</h1>
			</header>

			<section className="flex gap-6 items-start">
				<BillsSummary
					totalAmount={totalAmount}
					paidCount={paidCount}
					paidAmount={paidAmount}
					upcomingCount={upcomingCount}
					upcomingAmount={upcomingAmount}
					dueSoonCount={dueSoonCount}
					dueSoonAmount={dueSoonAmount}
					currency={settings.currency}
				/>
				<BillsTable
					bills={uniqueBills}
					currency={settings.currency}
					statusMap={statusRecord}
				/>
			</section>
		</div>
	);
}

function isInCurrentPeriod(
	txDate: Date,
	frequency: number | null,
	now: Date
): boolean {
	if (!frequency) return false;

	if (frequency <= 7) {
		const startOfWeek = new Date(now);
		const day = startOfWeek.getDay();
		const diff = day === 0 ? 6 : day - 1;
		startOfWeek.setDate(startOfWeek.getDate() - diff);
		startOfWeek.setHours(0, 0, 0, 0);

		const endOfWeek = new Date(startOfWeek);
		endOfWeek.setDate(endOfWeek.getDate() + 7);

		return txDate >= startOfWeek && txDate < endOfWeek;
	}

	if (frequency <= 30) {
		return (
			txDate.getMonth() === now.getMonth() &&
			txDate.getFullYear() === now.getFullYear()
		);
	}

	if (frequency <= 90) {
		const txQuarter = Math.floor(txDate.getMonth() / 3);
		const nowQuarter = Math.floor(now.getMonth() / 3);
		return (
			txQuarter === nowQuarter &&
			txDate.getFullYear() === now.getFullYear()
		);
	}

	return txDate.getFullYear() === now.getFullYear();
}

function checkDueSoon(
	lastDate: Date,
	frequency: number | null,
	now: Date
): boolean {
	if (!frequency) return false;

	const daysSinceLast =
		(now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

	if (daysSinceLast >= frequency) return true;

	const daysRemaining = frequency - daysSinceLast;
	return daysRemaining <= 5;
}
