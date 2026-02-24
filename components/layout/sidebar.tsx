'use client';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
	IconLayoutSidebarLeftCollapseFilled,
	IconLayoutSidebarLeftExpandFilled,
	IconLogout,
} from '@tabler/icons-react';
import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/shared';
import NavLink from '../ui/nav-link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { updateCurrency } from '@/actions/settings';
import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownTrigger,
	DropdownValue,
} from '../ui/dropdown';

const sidebarVariants = {
	open: { width: 256 },
	closed: { width: 64 },
};

export default function Sidebar({
	links,
	currentCurrency = 'USD',
}: {
	links: Link[];
	currentCurrency?: string;
}) {
	const [isOpen, setIsOpen] = useState(true);
	const router = useRouter();

	const { data: session } = authClient.useSession();
	const user = session?.user;

	const handleLogout = async () => {
		toast
			.promise(authClient.signOut(), {
				loading: 'Logging out...',
				success: 'Logged out successfully',
				error: 'Logout failed',
			})
			.then(() => {
				router.refresh();
				router.push('/auth/login');
			});
	};

	return (
		<motion.aside
			initial={false}
			animate={isOpen ? 'open' : 'closed'}
			variants={sidebarVariants}
			transition={{ type: 'spring', stiffness: 200, damping: 25 }}
			className={cn(
				'h-screen flex flex-col bg-grey-900 shrink-0 relative z-50',
				'fixed left-full lg:static'
			)}
		>
			<div
				className={cn(
					'h-16 flex items-center shrink-0 transition-all duration-200 mt-4',
					isOpen ? 'px-8 justify-between' : 'px-0 justify-center'
				)}
			>
				<AnimatePresence>
					{isOpen && (
						<motion.div
							key="logo-lg"
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -10 }}
							transition={{ duration: 0.2 }}
							className="shrink-0"
						>
							<Image
								src="/assets/images/logo-large.svg"
								alt="logo"
								width={112}
								height={32}
								priority
								className="w-auto"
							/>
						</motion.div>
					)}
				</AnimatePresence>

				<button
					onClick={() => setIsOpen(!isOpen)}
					className={cn(
						'flex items-center justify-center text-grey-300 hover:text-white transition-colors duration-200 group cursor-pointer',
						!isOpen && 'w-full'
					)}
					aria-label={isOpen ? 'Minimize Sidebar' : 'Expand Sidebar'}
				>
					{isOpen ? (
						<IconLayoutSidebarLeftCollapseFilled className="w-6 h-6 group-hover:scale-110 transition-transform" />
					) : (
						<IconLayoutSidebarLeftExpandFilled className="w-6 h-6 group-hover:scale-110 transition-transform" />
					)}
				</button>
			</div>

			<nav className="flex-1 py-8 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden">
				<ul className="flex flex-col gap-2">
					{links.map(link => (
						<NavLink key={link.href} isOpen={isOpen} link={link} />
					))}
				</ul>
			</nav>

			<div className="mt-auto pb-4">
				<ProfileDropdown
					user={user}
					isOpen={isOpen}
					onLogout={handleLogout}
					currentCurrency={currentCurrency}
				/>
			</div>
		</motion.aside>
	);
}

function ProfileDropdown({
	user,
	isOpen,
	onLogout,
	currentCurrency,
}: {
	user: typeof authClient.$Infer.Session.user | undefined;
	isOpen: boolean;
	onLogout: () => void;
	currentCurrency: string;
}) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleCurrencyChange = (newCurrency: string) => {
		startTransition(async () => {
			const res = await updateCurrency(newCurrency);
			if (res.success) {
				toast.success(`Currency updated to ${newCurrency}`);
			} else {
				toast.error('Failed to update currency');
			}
		});
	};

	return (
		<div className="relative">
			<AnimatePresence>
				{menuOpen && (
					<>
						<motion.div
							key="backdrop"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-40"
							onClick={() => setMenuOpen(false)}
						/>

						<motion.div
							key="dropdown"
							initial={{ opacity: 0, y: 10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 10, scale: 0.95 }}
							transition={{ duration: 0.15, ease: 'easeOut' }}
							className={cn(
								'absolute bottom-full mb-2 z-50 bg-white shadow-xl rounded-xl border border-grey-100 min-w-[200px]',
								!isOpen ? 'left-2' : 'left-4 right-4'
							)}
						>
							<div className="p-3 border-b border-grey-100/50 bg-grey-50 rounded-t-xl">
								<p className="font-preset-4-bold text-grey-900 truncate">
									{user?.name || 'User'}
								</p>
								<p className="font-preset-5 text-gray-500 truncate text-xs">
									{user?.email}
								</p>
							</div>

							<div className="p-1 border-b border-grey-100/50">
								<div className="flex items-center justify-between px-2 py-1.5 gap-4">
									<label className="text-sm font-medium text-grey-500 shrink-0">
										Currency
									</label>
									<Dropdown
										value={currentCurrency}
										onValueChange={handleCurrencyChange}
									>
										<DropdownTrigger
											className={cn(
												'w-28 py-1.5 px-2.5',
												isPending &&
													'opacity-50 cursor-not-allowed'
											)}
											disabled={isPending}
										>
											<DropdownValue />
										</DropdownTrigger>
										<DropdownContent>
											<DropdownItem value="USD">
												USD ($)
											</DropdownItem>
											<DropdownItem value="EUR">
												EUR (€)
											</DropdownItem>
											<DropdownItem value="GBP">
												GBP (£)
											</DropdownItem>
											<DropdownItem value="INR">
												INR (₹)
											</DropdownItem>
											<DropdownItem value="JPY">
												JPY (¥)
											</DropdownItem>
											<DropdownItem value="AUD">
												AUD (A$)
											</DropdownItem>
											<DropdownItem value="CAD">
												CAD (C$)
											</DropdownItem>
										</DropdownContent>
									</Dropdown>
								</div>
							</div>

							<div className="p-1">
								<button
									onClick={() => {
										setMenuOpen(false);
										onLogout();
									}}
									className="w-full flex items-center gap-2 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-preset-4 text-sm"
								>
									<IconLogout className="w-4 h-4" />
									Logout
								</button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			<button
				onClick={() => setMenuOpen(!menuOpen)}
				className={cn(
					'w-full flex items-center h-16 transition-colors duration-200'
				)}
			>
				<div className="w-16 flex justify-center shrink-0">
					{user?.image ? (
						<Image
							src={user.image}
							alt={user.name || 'User'}
							width={32}
							height={32}
							className="rounded-full border border-red-500/30"
						/>
					) : (
						<div className="w-8 h-8 rounded-full border border-grey-500 flex items-center justify-center text-white font-bold text-sm">
							{user?.name?.charAt(0) || 'U'}
						</div>
					)}
				</div>

				<span
					className={cn(
						'font-bold text-sm text-white truncate whitespace-nowrap overflow-hidden transition-all duration-200',
						isOpen ? 'opacity-100 max-w-30' : 'opacity-0 max-w-0'
					)}
				>
					{user?.name || 'User'}
				</span>
			</button>
		</div>
	);
}
