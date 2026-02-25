'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { startOfWeek, endOfWeek, format } from 'date-fns';

type PeriodMode = 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

export function DateFilterToolbar() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const urlPeriod = (searchParams.get('period') as PeriodMode) || 'all';
	const urlDate = searchParams.get('date') || '';
	const urlFrom = searchParams.get('from') || '';
	const urlTo = searchParams.get('to') || '';
	const urlMonth = searchParams.get('month') || '';
	const urlYear = searchParams.get('year') || '';

	const [isOpen, setIsOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<PeriodMode>(urlPeriod);
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [dateRange, setDateRange] = useState({
		from: new Date(),
		to: undefined as Date | undefined,
	});
	const [viewingYear, setViewingYear] = useState(new Date().getFullYear());
	const [yearPageStart, setYearPageStart] = useState(
		Math.floor(new Date().getFullYear() / 12) * 12
	);

	const containerRef = useRef<HTMLDivElement>(null);

	// Close popover when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);



	// Build the label shown on the button
	function getTriggerLabel() {
		if (urlPeriod === 'all') return 'All Time';
		if (urlPeriod === 'daily' && urlDate)
			return format(new Date(urlDate), 'MMM d, yyyy');
		if (urlPeriod === 'weekly' && urlDate) {
			const start = startOfWeek(new Date(urlDate), { weekStartsOn: 1 });
			const end = endOfWeek(new Date(urlDate), { weekStartsOn: 1 });
			return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
		}
		if (urlPeriod === 'monthly' && urlMonth)
			return format(new Date(`${urlMonth}-01`), 'MMMM yyyy');
		if (urlPeriod === 'yearly' && urlYear) return urlYear;
		if (urlPeriod === 'custom' && urlFrom && urlTo) {
			return `${format(new Date(urlFrom), 'MMM d, yyyy')} - ${format(new Date(urlTo), 'MMM d, yyyy')}`;
		}
		return 'Select Date';
	}

	// Push new filter params to the URL
	function applyFilter(
		period: PeriodMode,
		extraParams: Record<string, string> = {}
	) {
		const params = new URLSearchParams(searchParams.toString());

		// Clear old date params first
		['period', 'date', 'from', 'to', 'month', 'year', 'page'].forEach(k =>
			params.delete(k)
		);

		params.set('period', period);
		for (const [key, value] of Object.entries(extraParams)) {
			params.set(key, value);
		}

		router.push(`/accounts?${params.toString()}`);
		setIsOpen(false);
	}

	function handleDailyPick(date: Date | undefined) {
		if (!date) return;
		setSelectedDate(date);
		applyFilter('daily', { date: format(date, 'yyyy-MM-dd') });
	}

	function handleWeeklyPick(date: Date | undefined) {
		if (!date) return;
		setSelectedDate(date);
		const weekStart = startOfWeek(date, { weekStartsOn: 1 });
		applyFilter('weekly', { date: format(weekStart, 'yyyy-MM-dd') });
	}

	function handleRangePick(range: { from?: Date; to?: Date } | undefined) {
		if (!range) return;
		setDateRange({ from: range.from ?? new Date(), to: range.to });
		if (range.from && range.to) {
			applyFilter('custom', {
				from: format(range.from, 'yyyy-MM-dd'),
				to: format(range.to, 'yyyy-MM-dd'),
			});
		}
	}

	function handleMonthPick(monthIndex: number) {
		const month = `${viewingYear}-${String(monthIndex + 1).padStart(2, '0')}`;
		applyFilter('monthly', { month });
	}

	function handleYearPick(year: number) {
		applyFilter('yearly', { year: year.toString() });
	}

	return (
		<div
			ref={containerRef}
			className="relative z-40"
		>
			{/* Trigger button */}
			<button
				onClick={() => {
					if (!isOpen) setActiveTab(urlPeriod);
					setIsOpen(!isOpen);
				}}
				className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-sm font-semibold"
			>
				{getTriggerLabel()} ▾
			</button>

			{/* Dropdown */}
			{isOpen && (
				<div className="absolute top-full mt-2 right-0 z-50 w-[320px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="w-full flex gap-1 p-2 bg-gray-50 overflow-x-auto no-scrollbar">
						{(
							[
								'all',
								'daily',
								'weekly',
								'monthly',
								'yearly',
								'custom',
							] as PeriodMode[]
						).map(tab => (
							<button
								key={tab}
								onClick={() =>
									tab === 'all'
										? applyFilter('all')
										: setActiveTab(tab)
								}
								className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize shrink-0 ${activeTab === tab
									? 'bg-white shadow-sm text-black'
									: 'text-gray-500 hover:bg-gray-200'
									}`}
							>
								{tab}
							</button>
						))}
					</div>

					{/* Content based on active tab */}
					<div className="bg-white">
						{activeTab === 'daily' && (
							<DayPicker
								mode="single"
								selected={selectedDate}
								onSelect={handleDailyPick}
							/>
						)}

						{activeTab === 'weekly' && (
							<DayPicker
								mode="single"
								selected={selectedDate}
								onSelect={handleWeeklyPick}
								weekStartsOn={1}
								showOutsideDays
								modifiers={{
									selectedWeek: date => {
										const start = startOfWeek(
											selectedDate,
											{ weekStartsOn: 1 }
										);
										const end = endOfWeek(selectedDate, {
											weekStartsOn: 1,
										});
										return date >= start && date <= end;
									},
								}}
								modifiersClassNames={{
									selectedWeek: 'bg-gray-900 text-white',
								}}
							/>
						)}

						{activeTab === 'custom' && (
							<DayPicker
								mode="range"
								selected={{
									from: dateRange.from,
									to: dateRange.to,
								}}
								onSelect={handleRangePick}
							/>
						)}

						{activeTab === 'monthly' && (
							<div className="p-4">
								{/* Year nav */}
								<div className="flex items-center justify-between mb-3">
									<button
										onClick={() =>
											setViewingYear(y => y - 1)
										}
										className="p-1 rounded hover:bg-gray-100"
									>
										‹
									</button>
									<span className="font-bold text-sm">
										{viewingYear}
									</span>
									<button
										onClick={() =>
											setViewingYear(y => y + 1)
										}
										className="p-1 rounded hover:bg-gray-100"
									>
										›
									</button>
								</div>
								{/* Month grid */}
								<div className="grid grid-cols-3 gap-2">
									{MONTHS.map((name, i) => {
										const monthKey = `${viewingYear}-${String(i + 1).padStart(2, '0')}`;
										const isSelected =
											urlMonth === monthKey;
										return (
											<button
												key={name}
												onClick={() =>
													handleMonthPick(i)
												}
												className={`py-2 rounded-lg text-xs font-semibold ${isSelected
													? 'bg-gray-900 text-white'
													: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
													}`}
											>
												{name}
											</button>
										);
									})}
								</div>
							</div>
						)}

						{activeTab === 'yearly' && (
							<div className="p-4">
								{/* Page nav */}
								<div className="flex items-center justify-between mb-3">
									<button
										onClick={() =>
											setYearPageStart(y => y - 12)
										}
										className="p-1 rounded hover:bg-gray-100"
									>
										‹
									</button>
									<span className="font-bold text-sm">
										{yearPageStart} – {yearPageStart + 11}
									</span>
									<button
										onClick={() =>
											setYearPageStart(y => y + 12)
										}
										className="p-1 rounded hover:bg-gray-100"
									>
										›
									</button>
								</div>
								{/* Year grid */}
								<div className="grid grid-cols-3 gap-2">
									{Array.from(
										{ length: 12 },
										(_, i) => yearPageStart + i
									).map(year => (
										<button
											key={year}
											onClick={() => handleYearPick(year)}
											className={`py-2 rounded-lg text-xs font-semibold ${urlYear === year.toString()
												? 'bg-gray-900 text-white'
												: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
												}`}
										>
											{year}
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
