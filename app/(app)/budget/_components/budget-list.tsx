import DonutChart from '@/components/charts/pie';
import type { ChartData } from '@/components/charts/pie';
import { formatCurrency } from '@/lib/utils';

interface BudgetListProps {
	chartData: ChartData[];
	currency: string;
}

export function BudgetList({ chartData, currency }: BudgetListProps) {
	return (
		<div className="bg-white p-6 flex-3 flex flex-col gap-4 items-center rounded-xl h-fit">
			<DonutChart data={chartData} currency={currency} />
			<div className="flex items-start flex-col w-full gap-4">
				<h2 className="font-preset-3 font-semibold">
					Spending Summary
				</h2>
				<ul className="flex flex-col items-start gap-4 w-full">
					{chartData.map(data => (
						<li
							key={data.name}
							className="flex gap-4 items-center w-full p-1"
						>
							<hr
								className="h-6 w-1 border-none rounded-full"
								style={{ background: data.color }}
							/>
							<p className="font-preset-4">{data.name}</p>
							<span className="flex items-center gap-2 ml-auto">
								<p className="font-preset-4 font-semibold text-gray-600">
									{formatCurrency(data.value, currency)}
								</p>
								<p className="text-gray-500 font-preset-5 tracking-widest">
									of {formatCurrency(data.limit, currency)}
								</p>
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
