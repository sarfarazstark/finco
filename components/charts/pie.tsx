"use client";
import { useCallback, useMemo, useState } from 'react';
import {
	PieChart,
	Pie,
	ResponsiveContainer,
	Sector,
	Tooltip,
	type PieSectorShapeProps,
} from 'recharts';
import { cn, formatCurrency } from '@/lib/utils';

export interface ChartData {
	name: string;
	value: number;
	limit: number;
	color: string;
}

interface DonutChartProps {
	data: ChartData[];
	className?: string;
	currency: string;
}


const OVERSPENT_PATTERN_ID = 'overspent-pattern';

function RingSegment({
	cx, cy, innerRadius, outerRadius, startAngle, endAngle,
	fill, isActive, extraRadius = 0,
}: {
	cx: number; cy: number;
	innerRadius: number; outerRadius: number;
	startAngle: number; endAngle: number;
	fill: string; isActive: boolean;
	extraRadius?: number;
}) {
	const r = outerRadius + extraRadius;
	return (
		<g>
			<Sector
				cx={cx} cy={cy}
				innerRadius={innerRadius}
				outerRadius={r}
				startAngle={startAngle} endAngle={endAngle}
				fill={fill}
				className={cn(
					'transition-all ease-out',
					isActive ? 'duration-300' : 'duration-500',
				)}
			/>
			{isActive && (
				<Sector
					cx={cx} cy={cy}
					innerRadius={r + 2} outerRadius={r + 4}
					startAngle={startAngle} endAngle={endAngle}
					fill={fill}
					opacity={0.3}
				/>
			)}
		</g>
	);
}


function SpendSector(props: PieSectorShapeProps) {
	const {
		cx = 0, cy = 0,
		innerRadius = 0, outerRadius = 0,
		startAngle = 0, endAngle = 0,
		isActive = false,
		value = 0,
		payload,
	} = props;

	const color: string = payload?.color ?? '#000';
	const limit: number = payload?.limit ?? 0;
	const extra = isActive ? 6 : 0;

	if (value > limit) {
		const limitRatio = limit / value;
		const splitAngle = startAngle + (endAngle - startAngle) * limitRatio;
		return (
			<g>
				<RingSegment
					cx={cx} cy={cy}
					innerRadius={innerRadius} outerRadius={outerRadius}
					startAngle={startAngle} endAngle={splitAngle}
					fill={color} isActive={isActive} extraRadius={extra}
				/>
				<RingSegment
					cx={cx} cy={cy}
					innerRadius={innerRadius} outerRadius={outerRadius}
					startAngle={splitAngle} endAngle={endAngle}
					fill={`url(#${OVERSPENT_PATTERN_ID})`} isActive={isActive} extraRadius={extra}
				/>
			</g>
		);
	}

	return (
		<RingSegment
			cx={cx} cy={cy}
			innerRadius={innerRadius} outerRadius={outerRadius}
			startAngle={startAngle} endAngle={endAngle}
			fill={color} isActive={isActive} extraRadius={extra}
		/>
	);
}

function LimitSector(props: PieSectorShapeProps) {
	const {
		cx = 0, cy = 0,
		innerRadius = 0, outerRadius = 0,
		startAngle = 0, endAngle = 0,
		payload,
	} = props;

	return (
		<Sector
			cx={cx} cy={cy}
			innerRadius={innerRadius} outerRadius={outerRadius}
			startAngle={startAngle} endAngle={endAngle}
			fill={payload?.color ?? '#000'}
			opacity={0.7}
		/>
	);
}


function ChartTooltip({ active, payload, currency }: { active?: boolean; payload?: { payload: ChartData }[]; currency: string }) {
	if (!active || !payload?.length) return null;
	const item = payload[0].payload;
	const isOverLimit = item.value > item.limit;

	return (
		<div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-grey-100">
			<p className="font-preset-4 text-grey-900 font-medium">{item.name}</p>
			<p className="font-preset-5 text-grey-500">
				Spent:{' '}
				<span className={isOverLimit ? 'text-red-500' : 'text-grey-900'}>
					{formatCurrency(item.value, currency)}
				</span>
			</p>
			<p className="font-preset-5 text-grey-500">
				Limit: <span className="text-grey-900">{formatCurrency(item.limit, currency)}</span>
			</p>
		</div>
	);
}


export function DonutChart({ data, className, currency }: DonutChartProps) {
	const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

	const totals = useMemo(
		() => data.reduce(
			(acc, curr) => ({ spent: acc.spent + curr.value, limit: acc.limit + curr.limit }),
			{ spent: 0, limit: 0 },
		),
		[data],
	);

	const isOverBudget = useMemo(() => totals.spent > totals.limit, [totals]);

	const spendShape = useCallback(
		(props: PieSectorShapeProps) => (
			<SpendSector {...props} isActive={props.index === activeIndex} />
		),
		[activeIndex],
	);

	const limitShape = useCallback(
		(props: PieSectorShapeProps) => <LimitSector {...props} />,
		[],
	);

	return (
		<div className={cn('relative w-72 h-72 mx-auto', className)}>
			<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
				<span
					className={cn(
						'font-preset-2 font-bold tracking-tighter tabular-nums',
						isOverBudget ? 'text-red-500' : 'text-grey-900',
					)}
				>
					{formatCurrency(totals.spent, currency)}
				</span>
				<span className="font-preset-5 text-grey-500">
					of {formatCurrency(totals.limit, currency)}
				</span>
			</div>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart className="outline-none focus:outline-none focus-within:outline-none">
					<defs>
						<pattern
							id={OVERSPENT_PATTERN_ID}
							patternUnits="userSpaceOnUse"
							width="8" height="8"
							patternTransform="rotate(130)"
						>
							<line
								x1="0" y1="0" x2="8" y2="0"
								stroke="#c94736" opacity={0.5} strokeWidth="2"
							/>
						</pattern>
					</defs>

					<Pie
						data={data}
						shape={spendShape}
						cx="50%" cy="50%"
						innerRadius={80} outerRadius={110}
						dataKey="value"
						stroke="none"
						startAngle={90} endAngle={-270}
						animationBegin={0}
						animationDuration={1200}
						animationEasing="ease-out"
						onMouseEnter={(_, index) => setActiveIndex(index)}
						onMouseLeave={() => setActiveIndex(undefined)}
					/>

					<Pie
						data={data}
						shape={limitShape}
						cx="50%" cy="50%"
						innerRadius={60} outerRadius={80}
						dataKey="limit"
						stroke="none"
						startAngle={90} endAngle={-270}
						isAnimationActive={false}
					/>

					<Tooltip content={<ChartTooltip currency={currency} />} />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}

export default DonutChart;
