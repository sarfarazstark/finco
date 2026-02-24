"use client";
import React from 'react';
import {
	RadialBarChart,
	RadialBar,
	Legend,
	Tooltip,
	ResponsiveContainer,
	PolarAngleAxis,
} from 'recharts';

export interface Category {
	name: string;
	spent: number;
	maximum: number;
	color: string;
}

interface RadialChartProps {
	data: Category[];
}

const CustomTooltip = ({ active, payload }: { active: boolean; payload: { payload: Category }[] }) => {
	if (active && payload && payload.length) {
		const data = payload[0].payload;
		const isOverspent = data.spent > data.maximum;

		return (
			<div className="bg-[#202226] text-white px-4 py-3 rounded-md shadow-lg border border-gray-700 text-sm min-w-37.5">
				<p className="font-bold mb-2 border-b border-gray-600 pb-1">
					{data.name}
				</p>
				<div className="flex justify-between gap-4 mb-1">
					<span className="text-gray-400">Limit:</span>
					<span>${data.maximum.toFixed(2)}</span>
				</div>
				<div className="flex justify-between gap-4">
					<span className="text-gray-400">Spent:</span>
					<span className={isOverspent ? "text-red-400 font-bold" : "text-white"}>
						${data.spent.toFixed(2)}
					</span>
				</div>
				{isOverspent && (
					<p className="text-red-400 text-xs mt-2 font-semibold">
						Overspent by ${(data.spent - data.maximum).toFixed(2)}
					</p>
				)}
			</div>
		);
	}
	return null;
};

const RadialChart = ({ data }: RadialChartProps) => {
	const chartData = data.map((item) => {
		const percentage = (item.spent / item.maximum) * 100;
		const isOverspent = item.spent > item.maximum;

		return {
			...item,
			renderedValue: Math.min(percentage, 100),
			fill: isOverspent ? '#E11D48' : item.color,
		};
	});

	return (

		<div className="w-full h-60">
			<ResponsiveContainer width="100%" height="100%">
				<RadialBarChart
					cx="50%"
					cy="50%"
					innerRadius="30%"
					outerRadius="100%"
					barSize={16}
					data={chartData}
					startAngle={90}
					endAngle={-270}
				>
					<PolarAngleAxis
						type="number"
						domain={[0, 100]}
						angleAxisId={0}
						tick={false}
					/>

					<RadialBar
						background={{ fill: '#F8F4F0' }}
						dataKey="renderedValue"
						cornerRadius={10}
					/>

					<Tooltip content={<CustomTooltip active={false} payload={[]} />} cursor={false} />
				</RadialBarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default RadialChart;
