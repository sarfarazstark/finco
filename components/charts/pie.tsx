"use client";
import { useMemo } from 'react';
import {
	PieChart,
	Pie,
	ResponsiveContainer,
	Sector,
	Tooltip,
	type PieSectorShapeProps,
	type PieLabelRenderProps,
} from 'recharts';
import { cn } from '@/lib/utils';

export interface ChartData {
	name: string;
	value: number;
	limit: number;
	color: string;
}

interface DonutChartProps {
	data: ChartData[];
	className?: string;
}

const renderSector = (props: PieSectorShapeProps) => {
	const {
		cx,
		cy,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		isActive,
		value,
		payload,
	} = props;

	const color = payload?.color;
	const limit = payload?.limit ?? 0;
	const isOverspent = value > limit;

	const renderSegment = (sAngle: number, eAngle: number, fill: string, extraRadius: number = 0) => (
		<g>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius + extraRadius}
				startAngle={sAngle}
				endAngle={eAngle}
				fill={fill}
				className={cn("transition-all ease-out", isActive ? "duration-300" : "duration-500")}
			/>
			{isActive && (
				<Sector
					cx={cx}
					cy={cy}
					innerRadius={outerRadius + extraRadius + 2}
					outerRadius={outerRadius + extraRadius + 4}
					startAngle={sAngle}
					endAngle={eAngle}
					fill={fill}
					opacity={0.3}
				/>
			)}
		</g>
	);

	if (isOverspent) {
		const totalAngle = endAngle - startAngle;
		const limitRatio = limit / value;
		const splitAngle = startAngle + totalAngle * limitRatio;

		return (
			<g>
				{renderSegment(startAngle, splitAngle, color, isActive ? 6 : 0)}
				{renderSegment(splitAngle, endAngle, "url(#overspent-pattern)", isActive ? 6 : 0)}
			</g>
		);
	}

	return renderSegment(startAngle, endAngle, color, isActive ? 6 : 0);
};

const renderLimitSector = (props: PieSectorShapeProps) => {
	const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, payload } = props;

	const color = payload?.color;

	return (
		<Sector
			cx={cx}
			cy={cy}
			innerRadius={innerRadius}
			outerRadius={outerRadius}
			startAngle={startAngle}
			endAngle={endAngle}
			fill={color}
			opacity={0.7}
		/>
	);
};

export const DonutChart = ({
	data,
	className
}: DonutChartProps) => {
	const totals = useMemo(() => {
		return data.reduce((acc, curr) => ({
			spent: acc.spent + curr.value,
			limit: acc.limit + curr.limit
		}), { spent: 0, limit: 0 });
	}, [data]);

	const isOverBudget = totals.spent > totals.limit;

	const renderCenterLabel = (props: PieLabelRenderProps) => {
		const { cx, cy, index } = props;

		if (index !== 0) return null;

		return (
			<g
				className='selection:bg-blue selection:fill-white pie-label outline-none focus:outline-none select-none'
				tabIndex={-1}
			>
				<text
					x={cx}
					y={cy - 10}
					textAnchor="middle"
					dominantBaseline="middle"
					className={cn(
						"font-preset-2 tracking-tighter tabular-nums",
						isOverBudget ? "fill-red-500" : "fill-grey-900"
					)}
				>
					${totals.spent.toLocaleString()}
				</text>
				<text
					x={cx}
					y={cy + 15}
					textAnchor="middle"
					dominantBaseline="middle"
					className="font-preset-5 fill-grey-500"
				>
					of ${totals.limit.toLocaleString()}
				</text>
			</g>
		);
	};

	return (
		<div className={cn("relative w-72 h-72 mx-auto", className)}>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart
					className='selection:bg-blue selection:fill-white outline-none focus:outline-none focus-within:outline-none'
				>
					<defs>
						<pattern
							id="overspent-pattern"
							patternUnits="userSpaceOnUse"
							width="8"
							height="8"
							patternTransform="rotate(130)"
						>
							<line
								x1="0"
								y1="0"
								x2="8"
								y2="0"
								stroke="#c94736"
								opacity={0.5}
								strokeWidth="2"
							/>
						</pattern>
					</defs>
					<Pie
						shape={renderSector}
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={80}
						outerRadius={110}
						dataKey="value"
						stroke="none"
						startAngle={90}
						endAngle={-270}
						animationBegin={0}
						animationDuration={1200}
						animationEasing="ease-out"
						label={renderCenterLabel}
						labelLine={false}
					/>

					<Pie
						shape={renderLimitSector}
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={60}
						outerRadius={80}
						dataKey="limit"
						stroke="none"
						startAngle={90}
						endAngle={-270}
						isAnimationActive={false}
					/>

					<Tooltip
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								const data = payload[0].payload as ChartData;
								const isOverLimit = data.value > data.limit;
								return (
									<div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-grey-100">
										<p className="font-preset-4 text-grey-900 font-medium">{data.name}</p>
										<p className="font-preset-5 text-grey-500">
											Spent: <span className={isOverLimit ? "text-red-500" : "text-grey-900"}>${data.value.toLocaleString()}</span>
										</p>
										<p className="font-preset-5 text-grey-500">
											Limit: <span className="text-grey-900">${data.limit.toLocaleString()}</span>
										</p>
									</div>
								);
							}
							return null;
						}}
					/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

export default DonutChart;
