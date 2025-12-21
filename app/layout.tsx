import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/layout/sidebar';
import TransitionLayout from '@/components/layout/TransitionLayout';
import { Link } from '@/lib/shared';

export const metadata: Metadata = {
	title: 'Personal Finance App - Smarter spending, stronger savings',
	description:
		'Personal Finance App is a finance platform designed to help individuals track expenses, plan budgets, and manage savings with clarity and confidence.',
	icons: {
		icon: '/assets/images/logo-small.svg',
	},
};

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body>
				<Toaster
					position='top-right'
					toastOptions={{ duration: 3000, style: { fontSize: '14px' } }}
				/>
				<main className='grid grid-cols-[auto_1fr] h-screen'>
					<Sidebar links={links} />
					<TransitionLayout>
						<div>{children}</div>
					</TransitionLayout>
				</main>
			</body>
		</html>
	);
}
