'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const RANGES = [
	{ id: 'week', label: 'Weekly' },
	{ id: 'month', label: 'Monthly' },
	{ id: 'all', label: 'Total' },
] as const;

export function DateRangeFilter() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const activeRange = searchParams.get('range') || 'all';

	const handleRangeChange = (range: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (range === 'all') {
			params.delete('range');
		} else {
			params.set('range', range);
		}
		router.push(`?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="flex bg-white rounded-lg p-1 border border-grey-100 shadow-sm">
			{RANGES.map((range) => (
				<button
					key={range.id}
					onClick={() => handleRangeChange(range.id)}
					className={cn(
						'px-4 py-2 rounded-md font-preset-4 transition-all duration-200',
						activeRange === range.id
							? 'bg-grey-900 text-white shadow-sm'
							: 'text-grey-500 hover:text-grey-900 hover:bg-beige-100'
					)}
				>
					{range.label}
				</button>
			))}
		</div>
	);
}
