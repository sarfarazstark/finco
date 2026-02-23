"use client";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Label } from 'recharts';

export interface ChartData {
	name: string;
	value: number;
	color: string;
}

interface DonutChartProps {
	data: ChartData[];
	currentAmount: number | string;
	limitAmount: number | string;
}

const DonutChart = ({
	data,
	currentAmount,
	limitAmount,
}: DonutChartProps) => {
	const chartDataWithFill = data.map(item => ({
		...item,
		fill: item.color,
	}));

	return (
		<div className="w-60 h-60">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Tooltip
						cursor={false}
						contentStyle={{
							backgroundColor: '#202226',
							borderRadius: '8px',
							border: 'none',
							color: '#fff',
						}}
						itemStyle={{ color: '#fff' }}
					/>

					<Pie
						data={chartDataWithFill}
						cx="50%"
						cy="50%"
						innerRadius={80}
						outerRadius={120}
						paddingAngle={0}
						dataKey="value"
						stroke="none"
						startAngle={90}
						endAngle={-270}
					>
						<Label
							content={({ viewBox }) => {
								if (
									viewBox &&
									'cx' in viewBox &&
									'cy' in viewBox
								) {
									const { cx, cy } = viewBox;
									return (
										<text
											x={cx}
											y={cy}
											textAnchor="middle"
											dominantBaseline="central"
											className="flex flex-col gap-1"
										>
											<tspan
												x={cx}
												dy="-0.2em"
												className="font-preset-1 font-bold leading-tight text-grey-900"
											>
												${currentAmount}
											</tspan>
											<tspan
												x={cx}
												dy="2em"
												className="font-preset-5 leading-tight text-grey-900"
											>
												of ${limitAmount} limit
											</tspan>
										</text>
									);
								}
								return null;
							}}
						/>
					</Pie>

					<Pie
						data={[{ value: 1, fill: '#ffffff' }]}
						cx="50%"
						cy="50%"
						innerRadius={80}
						outerRadius={95}
						fillOpacity={0.3}
						dataKey="value"
						stroke="none"
						startAngle={90}
						endAngle={-270}
						isAnimationActive={false}
						pointerEvents="none"
					/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

export default DonutChart;
