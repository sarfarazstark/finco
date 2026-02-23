"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from 'recharts';

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
							color: '#fff'
						}}
						itemStyle={{ color: '#fff' }}
					/>

					<Pie
						data={data}
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
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={entry.color}
								className="outline-none focus:outline-none"
							/>
						))}

						<Label
							content={({ viewBox }) => {
								if (viewBox && "cx" in viewBox && "cy" in viewBox) {
									const { cx, cy } = viewBox;
									return (
										<text
											x={cx}
											y={cy}
											textAnchor="middle"
											dominantBaseline="central"
										>
											<tspan
												x={cx}
												dy="-0.2em"
												fontSize="30"
												fontWeight="bold"
												fill="#202226"
											>
												${currentAmount}
											</tspan>
											<tspan
												x={cx}
												dy="1.5em"
												fontSize="14"
												fill="#696868"
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
						data={[{ value: 1 }]}
						cx="50%"
						cy="50%"
						innerRadius={80}
						outerRadius={100}
						fill="#ffffff"
						fillOpacity={0.6}
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
