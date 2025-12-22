'use client';
import { motion } from 'motion/react';
import Image from 'next/image';
import {
	IconLayoutSidebarLeftCollapseFilled,
	IconLayoutSidebarLeftExpandFilled,
} from '@tabler/icons-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/shared';
import NavLink from '../ui/nav-link';

export default function Sidebar({ links }: { links: Link[] }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<motion.div
			animate={{
				width: isOpen ? 256 : 64,
			}}
			initial={false}
			transition={{
				type: 'spring',
				stiffness: 160,
				damping: 20,
				duration: 0.7,
			}}
			className={cn(
				'h-screen grid grid-rows-[auto_1fr_auto] gap-6 py-6 lg:bg-grey-900',
				'fixed left-full lg:static',
				{
					'max-w-64': isOpen,
					'w-16': !isOpen,
				},
			)}>
			<div
				className={cn(
					'flex px-4',
					'fixed top-0 left-0 right-0 z-10 bg-grey-900 lg:bg-transparent py-6 lg:py-0 lg:static lg:z-auto',
				)}>
				<Image
					src='/assets/images/logo-large.svg'
					alt='logo'
					width={100}
					height={100}
					priority
					className={cn('w-28 mx-auto lg:mx-0 lg:mr-auto', !isOpen && 'hidden')}
				/>

				<Image
					src='/assets/images/logo-small.svg'
					alt='logo'
					width={100}
					height={100}
					className={cn('h-5 w-max mx-auto hidden', { block: !isOpen })}
				/>
			</div>

			<nav
				className={cn(
					'p-4 lg:p-0 lg:pr-6 w-full lg:static',
					!isOpen && 'lg:pr-2',
					'fixed bottom-0 left-0 right-0 bg-grey-900 lg:bg-transparent',
				)}>
				<ul className='flex flex-row justify-between lg:justify-start lg:flex-col gap-2 md:gap-5 lg:gap-2 w-full'>
					{links.map((link) => (
						<NavLink key={link.href} isOpen={isOpen} link={link} />
					))}
				</ul>
			</nav>

			<div
				className={cn(
					'text-grey-100 cursor-pointer px-4 mt-auto items-center hidden lg:flex w-fit',
					{
						'justify-center': !isOpen,
					},
				)}
				onClick={() => setIsOpen((prev) => !prev)}>
				{isOpen ? (
					<IconLayoutSidebarLeftCollapseFilled
						className={cn('w-7 h-7 transition-transform duration-500')}
					/>
				) : (
					<IconLayoutSidebarLeftExpandFilled
						className={cn('w-7 h-7 transition-transform duration-500')}
					/>
				)}
			</div>
		</motion.div>
	);
}
