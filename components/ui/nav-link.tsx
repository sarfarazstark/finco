'use client';

import { Link as LinkSharedType } from '@/lib/shared';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useIsRoute } from '@/lib/utils';

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
		<li className='flex-1'>
			<Link
				href={link.href}
				className={cn(
					'cursor-pointer transition-colors duration-300 border-transparent',
					'text-grey-300 hover:text-grey-100',
					'flex items-center pt-3 pb-2 px-2 md:pt-4 md:pb-3 md:px-4 lg:px-0 lg:pl-6 lg:pr-8 lg:py-4',
					'lg:flex-row lg:rounded-br-xl lg:border-l-6',
					'flex-col rounded-tl-xl lg:rounded-tl-none rounded-tr-xl border-b-6 lg:border-b-0',
					'gap-1',
					isOpen ? 'lg:gap-5' : 'lg:justify-center lg:gap-0',

					isActive && 'bg-white text-grey-900 border-green hover:text-grey-900',
					!isOpen && 'lg:pl-3 lg:pr-4',
				)}>
				<Icon
					className={cn(
						'shrink-0 font-preset-5 lg:font-preset-3 ',
						isActive && 'text-green',
					)}
				/>

				<div
					className={cn(
						'hidden overflow-hidden transition-all duration-300',
						'md:block',
						isOpen ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0',
					)}>
					<span className='font-preset-5 lg:font-preset-3 font-bold whitespace-nowrap'>
						{link.label}
					</span>
				</div>
			</Link>
		</li>
	);
}
