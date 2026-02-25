import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import '@tabler/icons-webfont/dist/tabler-icons.css';

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
			<body className="overflow-hidden m-0 p-0">
				<NuqsAdapter>
					<Toaster
						position="top-right"
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
