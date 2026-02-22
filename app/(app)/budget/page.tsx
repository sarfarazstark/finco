import DonutChart from '@/components/charts/pie';

export default function Home() {
	return (
		<div className="p-8 max-w-5xl mx-auto">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Budget</h1>
			</header>

			<DonutChart />
		</div>
	);
}
