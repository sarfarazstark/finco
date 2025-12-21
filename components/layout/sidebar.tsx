'use client';
import { motion } from 'motion/react';
import Image from 'next/image';
import { IconArrowBigLeftLinesFilled } from '@tabler/icons-react';
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
				'w-full bg-grey-900 h-screen transition-none flex flex-col gap-12',
				{
					'max-w-64': isOpen,
					'w-16': !isOpen,
				},
			)}>
			<div className={cn('flex py-6 px-8', { 'px-4': !isOpen })}>
				<Image
					src='/assets/images/logo-large.svg'
					alt='logo'
					width={100}
					height={100}
					className={cn('w-28 mr-auto', {
						block: isOpen,
						hidden: !isOpen,
					})}
				/>

				<Image
					src='/assets/images/logo-small.svg'
					alt='logo'
					width={100}
					height={100}
					className={cn('h-6 mx-auto', {
						block: !isOpen,
						hidden: isOpen,
					})}
				/>
			</div>

			<nav className={cn('pr-6', !isOpen && 'pr-2')}>
				<ul className='flex flex-col gap-2'>
					{links.map((link) => (
						<NavLink isOpen={isOpen} key={link.href} link={link} />
					))}
				</ul>
			</nav>
			<div
				className={cn(
					'text-grey-100 cursor-pointer py-6 px-8 mt-auto transition-transform flex items-center',
					{
						'px-4': !isOpen,
					},
				)}
				onClick={() => setIsOpen((prev) => !prev)}>
				<IconArrowBigLeftLinesFilled
					className={cn('w-7 h-7 ml-auto transition-transform duration-500', {
						'rotate-180': !isOpen,
					})}
				/>

				<span
					className={cn(
						'font-preset-3 font-bold overflow-hidden transition-all duration-300 whitespace-nowrap',
						isOpen
							? 'opacity-100 ml-5 basis-auto max-w-[200px]'
							: 'opacity-0 ml-0 basis-0 max-w-0',
					)}>
					Minimize Menu
				</span>
			</div>
		</motion.div>
	);
}
