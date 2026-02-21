import Sidebar from '@/components/layout/sidebar';
import TransitionLayout from '@/components/layout/TransitionLayout';
import GlobalAddButton from '@/components/layout/global-add-button';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { Link } from '@/lib/shared';
import { redirect } from 'next/navigation';

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

	const dbCategories = await prisma.category.findMany({
		include: { icon: true }
	});

	const dbAccounts = await prisma.financialAccount.findMany({
		where: { userId: session.user.id },
		include: {
			transactions: {
				select: { amount: true }
			}
		}
	});

	const accounts = dbAccounts.map(a => ({
		id: a.id,
		name: a.name,
		icon: a.image || 'wallet',
		balance: a.transactions.reduce((sum, t) => sum + t.amount, 0)
	}));

	const categories = dbCategories.map(c => ({
		id: c.id,
		name: c.name,
		icon: c.icon?.name || 'category',
		color: c.icon ? `${c.icon.bg} ${c.icon.color}` : 'bg-grey-100 text-grey-600',
	}));

	const dbSettings = await prisma.setting.findUnique({
		where: { userId: session.user.id }
	});

	const settings = {
		currency: dbSettings?.currency || 'USD',
		theme: dbSettings?.theme || 'light'
	};

	return (
		<main className="grid grid-cols-[auto_1fr] h-screen overflow-hidden">
			<Sidebar links={links} />
			<TransitionLayout>{children}</TransitionLayout>
			<GlobalAddButton categories={categories} accounts={accounts} settings={settings} />
		</main>
	);
}
