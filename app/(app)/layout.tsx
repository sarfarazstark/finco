import Sidebar from '@/components/layout/sidebar';
import TransitionLayout from '@/components/layout/TransitionLayout';
import { Link } from '@/lib/shared';
import Logout from '@/components/layout/logout';

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

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className='grid grid-cols-[auto_1fr] h-screen'>
			<Sidebar links={links} />
			<Logout />
			<TransitionLayout>{children}</TransitionLayout>
		</main>
	);
}
