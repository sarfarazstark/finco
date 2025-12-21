import { Link } from '@/lib/shared';
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
	link: Link;
	isOpen: boolean;
}>) {
	const Icon = mapIcon[link.icon as keyof typeof mapIcon];

	const isActive = useIsRoute(link.href);
	return (
		<li
			className={cn(
				'text-grey-300 hover:text-grey-100 transition-all duration-300 cursor-pointer flex items-center pl-6 pr-8 py-4 rounded-br-xl rounded-tr-xl  border-l-6 border-transparent',
				isActive && 'bg-white text-grey-900 border-green hover:text-grey-900',
				!isOpen && 'pl-3 pr-4',
			)}>
			<span>
				<Icon className={cn('w-6 h-6', isActive && 'text-green')} />
			</span>
			<span
				className={cn(
					'ml-5 font-preset-3 font-bold overflow-hidden transition-all duration-300 whitespace-nowrap',
					isOpen
						? 'opacity-100 basis-auto max-w-[200px]'
						: 'opacity-0 basis-0 max-w-0',
				)}>
				{link.label}
			</span>
		</li>
	);
}
