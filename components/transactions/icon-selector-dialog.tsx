'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const COMMON_ICONS = [
	'building-bank',
	'cash',
	'credit-card',
	'receipt',
	'wallet',
	'coin',
	'report-money',
	'pizza',
	'coffee',
	'cup',
	'bottle',
	'apple',
	'meat',
	'car',
	'bus',
	'train',
	'plane',
	'bike',
	'gas-station',
	'home',
	'building',
	'lamp',
	'tools',
	'armchair',
	'shopping-cart',
	'bag',
	'shirt',
	'hanger',
	'gift',
	'device-desktop',
	'device-mobile',
	'device-gamepad',
	'camera',
	'headphone',
	'medical-cross',
	'heart',
	'pill',
	'bandage',
	'doctor',
	'school',
	'books',
	'ball-pen',
	'calculator',
	'movie',
	'music',
	'microphone',
	'palette',
	'brush',
	'bolt',
	'flame',
	'water',
	'leaf',
	'trees',
	'sun',
	'moon',
	'star',
	'trophy',
	'badge',
	'heart',
	'thumb-up',
	'user',
	'users',
	'briefcase',
	'id',
	'mail',
	'phone',
];

export function IconSelectorDialog({
	open,
	onOpenChange,
	onSelect,
	selectedIcon,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelect: (icon: string) => void;
	selectedIcon?: string;
}) {
	const [search, setSearch] = useState('');

	const filteredIcons = COMMON_ICONS.filter(icon =>
		icon.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md p-6">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<h3 className="text-xl font-bold text-grey-900">
							Select Icon
						</h3>
						<p className="text-sm text-grey-500">
							Choose a visual identifier for this transaction.
						</p>
					</div>

					<div className="relative">
						<input
							type="text"
							placeholder="Search icons..."
							value={search}
							onChange={e => setSearch(e.target.value)}
							className="w-full bg-grey-50 border border-transparent focus:border-grey-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:bg-white transition-all pl-10"
						/>
						<i className="ti ti-search absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-400" />
					</div>

					<div className="grid grid-cols-6 sm:grid-cols-8 gap-2 overflow-y-auto max-h-75 p-1.5 scrollbar-hide">
						{filteredIcons.map(icon => (
							<button
								key={icon}
								onClick={() => {
									onSelect(icon);
									onOpenChange(false);
								}}
								className={cn(
									'w-10 h-10 flex items-center justify-center rounded-lg transition-all',
									selectedIcon === icon
										? 'bg-grey-900 text-white shadow-lg'
										: 'bg-white border border-grey-100 text-grey-600 hover:bg-grey-50 hover:border-grey-200'
								)}
							>
								<i
									className={cn(
										'ti ti-' + icon,
										'text-[1.25rem]'
									)}
								/>
							</button>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
