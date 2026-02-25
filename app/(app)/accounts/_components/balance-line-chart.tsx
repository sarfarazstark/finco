'use client';

import { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { DailyTransaction } from '@/lib/data/accounts';
import { cn } from '@/lib/utils';
import { IconArrowUpRight, IconArrowDownLeft } from '@tabler/icons-react';

type ChartMode = 'both' | 'income' | 'expense';

export function BalanceLineChart({ data }: { data: DailyTransaction[] }) {
	const [mode, setMode] = useState<ChartMode>('both');

	if (data.length === 0) return null;

	const formatDate = (d: Date) =>
		`${d.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]}`;

	const chartData = data.map(d => ({
		date: d.date,
		income: d.income,
		expense: d.expense,
	}));

	return (
		<div className="bg-white rounded-2xl border border-grey-100 p-6 h-full flex flex-col">
			<div className="flex items-center justify-between mb-4">
				<p className="text-sm font-bold text-grey-900">Transactions</p>
				<div className="flex items-center gap-1.5">
					<button
						onClick={() =>
							setMode(m => (m === 'income' ? 'both' : 'income'))
						}
						className={cn(
							'w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer',
							mode === 'income'
								? 'bg-green text-white'
								: 'bg-grey-50 text-grey-400 hover:bg-grey-100'
						)}
					>
						<IconArrowDownLeft className="w-3.5 h-3.5" />
					</button>
					<button
						onClick={() =>
							setMode(m => (m === 'expense' ? 'both' : 'expense'))
						}
						className={cn(
							'w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer',
							mode === 'expense'
								? 'bg-red-400 text-white'
								: 'bg-grey-50 text-grey-400 hover:bg-grey-100'
						)}
					>
						<IconArrowUpRight className="w-3.5 h-3.5" />
					</button>
				</div>
			</div>

			<div className="flex-1 min-h-0">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={chartData}
						margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
					>
						<defs>
							<linearGradient
								id="incFill"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="0%"
									stopColor="#277C78"
									stopOpacity={0.15}
								/>
								<stop
									offset="100%"
									stopColor="#277C78"
									stopOpacity={0}
								/>
							</linearGradient>
							<linearGradient
								id="expFill"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="0%"
									stopColor="#F87171"
									stopOpacity={0.15}
								/>
								<stop
									offset="100%"
									stopColor="#F87171"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<Tooltip
							labelFormatter={label =>
								formatDate(new Date(label))
							}
							formatter={(
								value: number | undefined,
								name?: string
							) => [
								`$${(value ?? 0).toFixed(2)}`,
								name === 'income' ? 'Income' : 'Expense',
							]}
							contentStyle={{
								borderRadius: '8px',
								border: '1px solid #F2F2F2',
								fontSize: '12px',
								boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
							}}
						/>
						{(mode === 'both' || mode === 'income') && (
							<Area
								type="monotone"
								dataKey="income"
								stroke="#277C78"
								strokeWidth={2}
								fill="url(#incFill)"
								dot={false}
								activeDot={{
									r: 3,
									fill: '#277C78',
									stroke: 'white',
									strokeWidth: 2,
								}}
							/>
						)}
						{(mode === 'both' || mode === 'expense') && (
							<Area
								type="monotone"
								dataKey="expense"
								stroke="#F87171"
								strokeWidth={2}
								fill="url(#expFill)"
								dot={false}
								activeDot={{
									r: 3,
									fill: '#F87171',
									stroke: 'white',
									strokeWidth: 2,
								}}
							/>
						)}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
