'use client';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
	IconLayoutSidebarLeftCollapseFilled,
	IconLayoutSidebarLeftExpandFilled,
} from '@tabler/icons-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/shared';
import NavLink from '../ui/nav-link';

const sidebarVariants = {
	open: { width: 256 },
	closed: { width: 64 },
};

export default function Sidebar({ links }: { links: Link[] }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<motion.aside
			initial={false}
			animate={isOpen ? 'open' : 'closed'}
			variants={sidebarVariants}
			transition={{ type: 'spring', stiffness: 200, damping: 25 }}
			className={cn(
				'h-screen flex flex-col bg-grey-900 overflow-hidden shrink-0',
				'fixed left-full lg:static'
			)}
		>
			<div
				className={cn(
					'h-14 flex items-center shrink-0 transition-all duration-200',
					isOpen ? 'px-8' : 'px-0 justify-center'
				)}
			>
				<AnimatePresence mode="wait" initial={false}>
					{isOpen ? (
						<motion.div
							key="logo-lg"
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -10 }}
							transition={{ duration: 0.2 }}
						>
							<Image
								src="/assets/images/logo-large.svg"
								alt="logo"
								width={112}
								height={32}
								priority
								className="w-28"
							/>
						</motion.div>
					) : (
						<motion.div
							key="logo-sm"
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.5 }}
							transition={{ duration: 0.2 }}
							className="flex justify-center"
						>
							<Image
								src="/assets/images/logo-small.svg"
								alt="logo"
								width={16}
								height={16}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<nav className="flex-1 py-4">
				<ul className="flex flex-col gap-2">
					{links.map(link => (
						<NavLink key={link.href} isOpen={isOpen} link={link} />
					))}
				</ul>
			</nav>

			<div className="p-4 mt-auto">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="w-full flex items-center text-grey-300 hover:text-white transition-colors duration-200"
				>
					<div className="w-8 flex justify-center shrink-0">
						{isOpen ? (
							<IconLayoutSidebarLeftCollapseFilled className="w-6 h-6" />
						) : (
							<IconLayoutSidebarLeftExpandFilled className="w-6 h-6" />
						)}
					</div>

					<AnimatePresence>
						{isOpen && (
							<motion.span
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								className="ml-4 font-bold text-sm whitespace-nowrap overflow-hidden"
							>
								Minimize Menu
							</motion.span>
						)}
					</AnimatePresence>
				</button>
			</div>
		</motion.aside>
	);
}
