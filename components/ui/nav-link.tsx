'use client';

import { Link as LinkSharedType } from '@/lib/shared';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useIsRoute } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import {
	IconHomeFilled,
	IconArrowsUpDown,
	IconChartPie4Filled,
	IconPigFilled,
	IconReceiptFilled,
} from '@tabler/icons-react';

const mapIcon = {
	home: IconHomeFilled,
	transactions: IconArrowsUpDown,
	budget: IconChartPie4Filled,
	pots: IconPigFilled,
	recurringBills: IconReceiptFilled,
};

export default function NavLink({
	link,
	isOpen,
}: Readonly<{
	link: LinkSharedType;
	isOpen: boolean;
}>) {
	const Icon = mapIcon[link.icon as keyof typeof mapIcon];
	const isActive = useIsRoute(link.href);

	return (
		<li>
			<Link
				href={link.href}
				className={cn(
					'group relative flex items-center h-12 transition-colors duration-200',
					isActive
						? 'text-grey-900'
						: 'text-grey-300 hover:text-white'
				)}
			>
				<AnimatePresence initial={false}>
					{isActive && (
						<motion.div
							layoutId="active-bg"
							className="absolute inset-y-0 left-0 right-2 bg-white rounded-r-xl border-l-[6px] border-green z-0"
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 30,
							}}
						/>
					)}
				</AnimatePresence>

				<div className="relative z-10 w-16 flex justify-center shrink-0">
					<Icon
						className={cn(
							'w-5 h-5 transition-colors duration-200',
							isActive
								? 'text-green'
								: 'text-grey-300 group-hover:text-white'
						)}
					/>
				</div>

				<AnimatePresence>
					{isOpen && (
						<motion.span
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -10 }}
							transition={{ duration: 0.2 }}
							className="relative z-10 font-bold text-base whitespace-nowrap overflow-hidden pr-6"
						>
							{link.label}
						</motion.span>
					)}
				</AnimatePresence>
			</Link>
		</li>
	);
}
