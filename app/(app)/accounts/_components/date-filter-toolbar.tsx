'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { cn } from '@/lib/utils';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

type PeriodMode = 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

const PERIODS: { label: string; value: PeriodMode }[] = [
	{ label: 'All', value: 'all' },
	{ label: 'Daily', value: 'daily' },
	{ label: 'Weekly', value: 'weekly' },
	{ label: 'Monthly', value: 'monthly' },
	{ label: 'Yearly', value: 'yearly' },
	{ label: 'Custom', value: 'custom' },
];

const MONTHS = [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function getWeekStart(date: Date): Date {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1);
	d.setDate(diff);
	d.setHours(0, 0, 0, 0);
	return d;
}

function getWeekEnd(date: Date): Date {
	const start = getWeekStart(date);
	const end = new Date(start);
	end.setDate(end.getDate() + 6);
	return end;
}

export function DateFilterToolbar() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentPeriod = (searchParams.get('period') as PeriodMode) || 'all';

	const [monthYear, setMonthYear] = useState(new Date().getFullYear());
	const [yearPageStart, setYearPageStart] = useState(
		Math.floor(new Date().getFullYear() / 12) * 12
	);

	const buildUrl = (params: Record<string, string>) => {
		const sp = new URLSearchParams(searchParams.toString());
		sp.delete('period');
		sp.delete('date');
		sp.delete('from');
		sp.delete('to');
		sp.delete('month');
		sp.delete('year');
		sp.delete('page');
		Object.entries(params).forEach(([k, v]) => sp.set(k, v));
		return `/accounts?${sp.toString()}`;
	};

	const handlePeriodChange = (period: PeriodMode) => {
		if (period === 'all') {
			router.push(buildUrl({ period: 'all' }));
		} else {
			const today = new Date().toISOString().split('T')[0];
			if (period === 'daily') {
				router.push(buildUrl({ period, date: today }));
			} else if (period === 'weekly') {
				const ws = getWeekStart(new Date()).toISOString().split('T')[0];
				router.push(buildUrl({ period, date: ws }));
			} else if (period === 'monthly') {
				const m = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
				router.push(buildUrl({ period, month: m }));
			} else if (period === 'yearly') {
				router.push(
					buildUrl({
						period,
						year: new Date().getFullYear().toString(),
					})
				);
			} else if (period === 'custom') {
				router.push(buildUrl({ period, from: today, to: today }));
			}
		}
	};

	const handleDailyDate = (date: Date | null) => {
		if (!date) return;
		router.push(
			buildUrl({
				period: 'daily',
				date: date.toISOString().split('T')[0],
			})
		);
	};

	const handleWeeklyDate = (date: Date | null) => {
		if (!date) return;
		const ws = getWeekStart(date).toISOString().split('T')[0];
		router.push(buildUrl({ period: 'weekly', date: ws }));
	};

	const handleMonthSelect = (monthIdx: number) => {
		const m = `${monthYear}-${String(monthIdx + 1).padStart(2, '0')}`;
		router.push(buildUrl({ period: 'monthly', month: m }));
	};

	const handleYearSelect = (year: number) => {
		router.push(
			buildUrl({ period: 'yearly', year: year.toString() })
		);
	};

	const [customDateRange, setCustomDateRange] = useState<
		[Date | null, Date | null]
	>([
		searchParams.get('from')
			? new Date(searchParams.get('from')!)
			: new Date(),
		searchParams.get('to') ? new Date(searchParams.get('to')!) : null,
	]);

	const handleCustomRange = (dates: [Date | null, Date | null]) => {
		setCustomDateRange(dates);
		const [start, end] = dates;
		if (start && end) {
			const from = start.toISOString().split('T')[0];
			const to = end.toISOString().split('T')[0];
			router.push(buildUrl({ period: 'custom', from, to }));
		}
	};

	const selectedDate = searchParams.get('date')
		? new Date(searchParams.get('date')!)
		: new Date();

	const selectedMonth = searchParams.get('month') || '';
	const selectedYear = searchParams.get('year') || '';

	return (
		<div className="relative z-40">
			<div className="flex items-center gap-2 flex-wrap">
				{PERIODS.map(p => (
					<button
						key={p.value}
						onClick={() => handlePeriodChange(p.value)}
						className={cn(
							'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer',
							currentPeriod === p.value
								? 'bg-grey-900 text-white'
								: 'bg-white text-grey-500 border border-grey-200 hover:border-grey-400'
						)}
					>
						{p.label}
					</button>
				))}
			</div>

			<div className="absolute top-full mt-2 left-0 z-50">
				{currentPeriod === 'daily' && (
					<div className="w-48 shadow-lg rounded-lg">
						<ReactDatePicker
							selected={selectedDate}
							onChange={handleDailyDate}
							dateFormat="dd MMM yyyy"
							className="w-full bg-white border border-grey-200 rounded-lg px-3 py-2 text-sm text-grey-900 focus:outline-none focus:border-grey-400 cursor-pointer"
							wrapperClassName="w-full"
						/>
					</div>
				)}

				{currentPeriod === 'weekly' && (
					<div className="w-64 shadow-lg rounded-lg bg-white p-2 border border-grey-200">
						<ReactDatePicker
							selected={selectedDate}
							onChange={handleWeeklyDate}
							dateFormat="dd MMM yyyy"
							calendarStartDay={1}
							highlightDates={[
								{
									'react-datepicker__day--highlighted':
										(() => {
											const ws =
												getWeekStart(selectedDate);
											const days = [];
											for (let i = 0; i < 7; i++) {
												const d = new Date(ws);
												d.setDate(d.getDate() + i);
												days.push(d);
											}
											return days;
										})(),
								},
							]}
							className="w-full bg-white border border-grey-200 rounded-lg px-3 py-2 text-sm text-grey-900 focus:outline-none focus:border-grey-400 cursor-pointer"
							wrapperClassName="w-full"
						/>
						<p className="text-[10px] text-grey-400 mt-2 text-center">
							Week:{' '}
							{getWeekStart(selectedDate).toLocaleDateString(
								'en',
								{
									day: 'numeric',
									month: 'short',
								}
							)}{' '}
							—{' '}
							{getWeekEnd(selectedDate).toLocaleDateString('en', {
								day: 'numeric',
								month: 'short',
							})}
						</p>
					</div>
				)}

				{currentPeriod === 'monthly' && (
					<div className="bg-white border border-grey-200 shadow-lg rounded-xl p-4 w-64">
						<div className="flex items-center justify-between mb-3">
							<button
								onClick={() => setMonthYear(y => y - 1)}
								className="w-7 h-7 rounded-full bg-grey-50 flex items-center justify-center hover:bg-grey-100 transition-colors cursor-pointer"
							>
								<IconChevronLeft className="w-4 h-4 text-grey-500" />
							</button>
							<span className="text-sm font-bold text-grey-900">
								{monthYear}
							</span>
							<button
								onClick={() => setMonthYear(y => y + 1)}
								className="w-7 h-7 rounded-full bg-grey-50 flex items-center justify-center hover:bg-grey-100 transition-colors cursor-pointer"
							>
								<IconChevronRight className="w-4 h-4 text-grey-500" />
							</button>
						</div>
						<div className="grid grid-cols-3 gap-2">
							{MONTHS.map((m, i) => {
								const key = `${monthYear}-${String(i + 1).padStart(2, '0')}`;
								const isSelected = selectedMonth === key;
								return (
									<button
										key={m}
										onClick={() => handleMonthSelect(i)}
										className={cn(
											'py-2 rounded-lg text-xs font-bold transition-all cursor-pointer',
											isSelected
												? 'bg-grey-900 text-white'
												: 'bg-grey-50 text-grey-600 hover:bg-grey-100'
										)}
									>
										{m}
									</button>
								);
							})}
						</div>
					</div>
				)}

				{currentPeriod === 'yearly' && (
					<div className="bg-white border border-grey-200 shadow-lg rounded-xl p-4 w-64">
						<div className="flex items-center justify-between mb-3">
							<button
								onClick={() => setYearPageStart(y => y - 12)}
								className="w-7 h-7 rounded-full bg-grey-50 flex items-center justify-center hover:bg-grey-100 transition-colors cursor-pointer"
							>
								<IconChevronLeft className="w-4 h-4 text-grey-500" />
							</button>
							<span className="text-sm font-bold text-grey-900">
								{yearPageStart} — {yearPageStart + 11}
							</span>
							<button
								onClick={() => setYearPageStart(y => y + 12)}
								className="w-7 h-7 rounded-full bg-grey-50 flex items-center justify-center hover:bg-grey-100 transition-colors cursor-pointer"
							>
								<IconChevronRight className="w-4 h-4 text-grey-500" />
							</button>
						</div>
						<div className="grid grid-cols-3 gap-2">
							{Array.from({ length: 12 }, (_, i) => {
								const year = yearPageStart + i;
								const isSelected =
									selectedYear === year.toString();
								return (
									<button
										key={year}
										onClick={() => handleYearSelect(year)}
										className={cn(
											'py-2 rounded-lg text-xs font-bold transition-all cursor-pointer',
											isSelected
												? 'bg-grey-900 text-white'
												: 'bg-grey-50 text-grey-600 hover:bg-grey-100'
										)}
									>
										{year}
									</button>
								);
							})}
						</div>
					</div>
				)}

				{currentPeriod === 'custom' && (
					<div className="w-64 shadow-lg rounded-lg">
						<ReactDatePicker
							selected={customDateRange[0]}
							onChange={handleCustomRange}
							startDate={customDateRange[0]}
							endDate={customDateRange[1]}
							selectsRange
							dateFormat="dd MMM yyyy"
							className="w-full bg-white border border-grey-200 rounded-lg px-3 py-2 text-sm text-grey-900 focus:outline-none focus:border-grey-400 cursor-pointer"
							wrapperClassName="w-full"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
