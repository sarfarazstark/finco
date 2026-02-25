'use client';

import { useState } from 'react';
import { DailyTransaction } from '@/lib/data/accounts';
import { cn } from '@/lib/utils';
import { IconArrowUpRight, IconArrowDownLeft } from '@tabler/icons-react';

type Filter = 'incoming' | 'outgoing';

export function IncomeExpenseChart({ data }: { data: DailyTransaction[] }) {
	const [filter, setFilter] = useState<Filter>('incoming');

	if (data.length === 0) return null;

	const maxVal = Math.max(
		...data.map(d => (filter === 'incoming' ? d.income : d.expense)),
		1
	);

	const startDate = new Date(data[0].date);
	const endDate = new Date(data[data.length - 1].date);
	const formatDate = (d: Date) =>
		`${d.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]}`;

	const color = filter === 'incoming' ? '#277C78' : '#F87171';
	const sign = filter === 'incoming' ? '+' : '-';

	return (
		<div className="bg-white rounded-2xl border border-grey-100 p-6 h-full flex flex-col">
			<div className="flex items-center justify-between mb-4">
				<p className="text-sm font-bold text-grey-900">Histogram</p>
				<div className="flex items-center gap-1.5">
					<button
						onClick={() => setFilter('incoming')}
						className={cn(
							'w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer',
							filter === 'incoming'
								? 'bg-green text-white'
								: 'bg-grey-50 text-grey-400 hover:bg-grey-100'
						)}
					>
						<IconArrowDownLeft className="w-3.5 h-3.5" />
					</button>
					<button
						onClick={() => setFilter('outgoing')}
						className={cn(
							'w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer',
							filter === 'outgoing'
								? 'bg-red-400 text-white'
								: 'bg-grey-50 text-grey-400 hover:bg-grey-100'
						)}
					>
						<IconArrowUpRight className="w-3.5 h-3.5" />
					</button>
				</div>
			</div>

			<div className="flex-1 flex items-end gap-2 min-h-0">
				{data.map(d => {
					const value = filter === 'incoming' ? d.income : d.expense;
					const heightPct = maxVal > 0 ? (value / maxVal) * 100 : 0;

					return (
						<div
							key={d.date}
							className="flex-1 flex items-end h-full bg-beige-100"
							title={`${d.date}: ${sign}$${value.toFixed(2)}`}
						>
							<div
								className="w-full rounded-t transition-all duration-300 hover:opacity-100 cursor-help"
								style={{
									height: `${Math.max(heightPct, 1)}%`,
									backgroundColor: color,
									opacity: value > 0 ? 0.85 : 0.08,
								}}
							/>
						</div>
					);
				})}
			</div>

			<div className="flex justify-between mt-3 text-[10px] text-grey-400 border-t border-grey-50 pt-2">
				<span>{formatDate(startDate)}</span>
				<span>{formatDate(endDate)}</span>
			</div>
		</div>
	);
}
