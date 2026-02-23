import DonutChart from '@/components/charts/pie';
import type { ChartData } from '@/components/charts/pie';

export default function Home() {
	const dynamicBudgetData: ChartData[] = [
		{ name: 'Teal Segment', value: 8, color: '#328281' },
		{ name: 'Blue Segment', value: 55, color: '#88cddd' },
		{ name: 'Beige Segment', value: 17, color: '#f3ceab' },
		{ name: 'Gray Segment', value: 20, color: '#60626f' },
	];

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Budget</h1>
			</header>

			<DonutChart
				data={dynamicBudgetData}
				currentAmount={338}
				limitAmount={975}
			/>
		</div>
	);
}
