import Sidebar from '@/components/layout/sidebar';
import TransitionLayout from '@/components/layout/TransitionLayout';
import { Link } from '@/lib/shared';

import GlobalAddButton from '@/components/layout/global-add-button';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

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
		return null; // Better Auth usually handles protection, but safe-guarding
	}

	return (
		<main className="grid grid-cols-[auto_1fr] h-screen overflow-hidden">
			<Sidebar links={links} />
			<TransitionLayout>{children}</TransitionLayout>
			<GlobalAddButton />
		</main>
	);
}
