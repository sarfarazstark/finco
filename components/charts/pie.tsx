"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

const data = [
	{ name: 'Teal Segment', value: 8 },
	{ name: 'Blue Segment', value: 55 },
	{ name: 'Beige Segment', value: 17 },
	{ name: 'Gray Segment', value: 20 },
];

const COLORS = ['#328281', '#88cddd', '#f3ceab', '#60626f'];

const DonutChart = () => {
	return (
		<div style={{ width: '100%', height: 400 }}>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={110}
						outerRadius={150}
						fill="#8884d8"
						paddingAngle={0}
						dataKey="value"
						stroke="none"
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}

						<Label
							content={({ viewBox }) => {
								if (
									viewBox &&
									'cx' in viewBox &&
									'cy' in viewBox
								) {
									return (
										<text
											x={viewBox.cx}
											y={viewBox.cy}
											textAnchor="middle"
											dominantBaseline="central"
										>
											<tspan
												x={viewBox.cx}
												dy="-0.2em"
												fontSize="48"
												fontWeight="700"
												fill="#222328"
											>
												$338
											</tspan>
											<tspan
												x={viewBox.cx}
												dy="1.6em"
												fontSize="18"
												fill="#757575"
											>
												of $975 limit
											</tspan>
										</text>
									);
								}
								return null;
							}}
						/>
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

export default DonutChart;
