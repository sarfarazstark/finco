import Sidebar from '@/components/layout/sidebar';
import TransitionLayout from '@/components/layout/TransitionLayout';
import GlobalAddButton from '@/components/layout/global-add-button';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { Link } from '@/lib/shared';
import { redirect } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { generateRecurringTransactions } from '@/lib/generate-recurring';
import { getSetting } from '@/hooks/use-setting';

const links: Link[] = [
	{
		label: 'Overview',
		href: '/',
		icon: 'home',
	},
	{
		label: 'Transactions',
		href: '/transactions',
		icon: 'transactions',
	},
	{
		label: 'Budget',
		href: '/budget',
		icon: 'budget',
	},
	{
		label: 'Pots',
		href: '/pots',
		icon: 'pots',
	},
	{
		label: 'Recurring Bills',
		href: '/recurring-bills',
		icon: 'recurringBills',
	},
	{
		label: 'Accounts',
		href: '/accounts',
		icon: 'accounts',
	},
];

export default async function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return redirect('/auth/login');
	}

	await generateRecurringTransactions(session.user.id);

	const [dbCategories, dbAccounts, dbIcons] = await Promise.all([
		prisma.category.findMany({
			include: { icon: true },
		}),
		prisma.financialAccount.findMany({
			where: { userId: session.user.id },
			include: {
				transactions: {
					select: { amount: true },
				},
			},
		}),
		prisma.icon.findMany(),
	]);


	const accounts = dbAccounts.map(a => ({
		id: a.id,
		name: a.name,
		icon: a.image || 'wallet',
		balance: a.transactions.reduce((sum, t) => sum + t.amount, 0),
	}));

	const categories = dbCategories.map(c => ({
		id: c.id,
		name: c.name,
		icon: c.icon?.name || 'category',
		color: c.icon
			? `${c.icon.color} text-white`
			: 'bg-grey-100 text-grey-600',
	}));

	const settings = await getSetting(session.user.id);

	return (
		<main className="grid grid-cols-[auto_1fr] h-screen overflow-hidden">
			<Sidebar links={links} currentCurrency={settings?.currency} />
			<TransitionLayout>{children}</TransitionLayout>
			<GlobalAddButton
				categories={categories}
				accounts={accounts}
				settings={settings!}
				dbIcons={dbIcons}
			/>
			<Toaster position="bottom-right" />
		</main>
	);
}
