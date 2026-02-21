import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const metadata: Metadata = {
	title: 'Personal Finance App - Smarter spending, stronger savings',
	description:
		'Personal Finance App is a finance platform designed to help individuals track expenses, plan budgets, and manage savings with clarity and confidence.',
	icons: {
		icon: '/assets/images/logo-small.svg',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<NuqsAdapter>
					<Toaster
						position="bottom-right"
						toastOptions={{
							duration: 3000,
							style: { fontSize: '14px' },
						}}
					/>
					{children}
				</NuqsAdapter>
			</body>
		</html>
	);
}
