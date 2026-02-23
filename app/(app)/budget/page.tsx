import DonutChart from '@/components/charts/pie';
import type { ChartData } from '@/components/charts/pie';
import { IconChevronRight } from '@tabler/icons-react';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getSetting } from '@/hooks/use-setting';
import { formatCurrency, formatTransactionDate } from '@/lib/utils';
import { ResolvedImage } from '@/components/transactions/resolved-image';
import Link from 'next/link';
import { BudgetActions } from './_components/budget-actions';

export default async function Budget() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return redirect('/auth/login');
	}

	const categories = await prisma.category.findMany({
		where: {
			userId: session.user.id,
			budgets: {
				some: {
					userId: session.user.id,
				},
			},
		},
		include: {
			budgets: {
				include: {
					theme: true,
				},
			},
			transactions: {
				take: 3,
				orderBy: {
					createdAt: 'desc',
				},
				include: {
					category: {
						include: {
							icon: true,
						},
					},
					account: true,
				},
			},
		},
	});

	const formattedCategories = await Promise.all(
		categories.map(async (category) => {
			const spentResult = await prisma.transaction.aggregate({
				where: {
					categoryId: category.id,
					createdAt: {
						gte: new Date(new Date().setDate(new Date().getDate() - 7)),
					},
				},
				_sum: {
					amount: true,
				},
			});

			return {
				...category,
				spent: Number(spentResult._sum.amount || 0),
			};
		})
	);

	const chartData: ChartData[] = formattedCategories.map((category) => ({
		name: category.name,
		value: Math.abs(category.spent),
		limit: category.budgets[0]?.maximum || 0,
		color: category.budgets[0]?.theme?.hex || '#cccccc'
	}));

	const settings = await getSetting(session.user.id);

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Budget</h1>
			</header>

			<section className="flex gap-4">
				<div className="bg-white p-6 flex-3 flex flex-col gap-4 items-center rounded-xl h-fit">
					<DonutChart data={chartData} currency={settings.currency} />
					<div className="flex items-start flex-col w-full gap-4">
						<h2 className="font-preset-3 font-semibold">
							Spending Summary
						</h2>
						<ul className="flex flex-col items-start gap-4 w-full">
							{chartData.map((data) => (
								<li key={data.name} className="flex gap-4 items-center w-full p-1">
									<hr
										className="h-6 w-1 border-none rounded-full"
										style={{ background: data.color }}
									/>
									<p className="font-preset-4">{data.name}</p>
									<span className="flex items-center gap-2 ml-auto">
										<p className="font-preset-4 font-semibold text-gray-600">
											{formatCurrency(data.value, settings.currency)}
										</p>
										<p className="text-gray-500 font-preset-5 tracking-widest">
											of {formatCurrency(data.limit, settings.currency)}
										</p>
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="flex-5 flex flex-col gap-4">
					{formattedCategories.map((budget) => (
						<div key={budget.id} className="w-full bg-white rounded-xl p-8">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-4">
									<div className="w-4 h-4 rounded-full" style={{ background: budget.budgets[0]?.theme?.hex || '#cccccc' }}></div>
									<h2 className="font-preset-3 font-semibold">
										{budget.name}
									</h2>
								</div>
								<BudgetActions
									budgetId={budget.id}
									budgetName={budget.name}
								/>
							</div>

							<div className="mb-6">
								<p className="font-preset-5 mb-4">
									Maximum of {formatCurrency(budget.budgets[0]?.maximum || 0, settings.currency)}
								</p>
								<div className="w-full h-8 bg-[#F8F4F0] rounded p-1">
									<div className="h-full rounded-sm w-[30%]" style={{ background: budget.budgets[0]?.theme?.hex || '#cccccc' }}></div>
								</div>
							</div>

							<div className="flex mb-8 mt-6">
								<div className="flex w-1/2 items-start gap-4">
									<div className="w-1 h-11 rounded-full" style={{ background: budget.budgets[0]?.theme?.hex || '#cccccc' }}></div>
									<div className="flex flex-col">
										<p className="font-preset-5 mb-1">Spent</p>
										<p className="font-preset-5-bold">{formatCurrency(Math.abs(budget.spent), settings.currency)}</p>
									</div>
								</div>

								<div className="flex w-1/2 items-start gap-4">
									<div className="w-1 h-11 rounded-full bg-[#F8F4F0]"></div>
									<div className="flex flex-col">
										<p className="font-preset-5 mb-1">
											Remaining
										</p>
										<p className="font-preset-5-bold">{formatCurrency(Math.abs(budget.budgets[0]?.maximum || 0) - Math.abs(budget.spent), settings.currency)}</p>
									</div>
								</div>
							</div>

							<div className="bg-[#F8F4F0] rounded-xl p-5">
								<div className="flex justify-between items-center mb-5">
									<h3 className="font-preset-3 font-semibold">
										Latest Spending
									</h3>
									<Link href={`/transactions?category=${encodeURIComponent(budget.name)}`} className="flex items-center gap-2 text-[14px] text-grey-500 hover:text-[#202226] transition-colors">
										See All
										<IconChevronRight />
									</Link>
								</div>

								<div className="flex flex-col">
									{budget.transactions.map((tx, index) => (
										<div key={tx.id} className={`flex items-center justify-between py-3 ${index === budget.transactions.length - 1 ? 'border-none' : 'border-b border-[#E0DEDC]'}`}>
											<div className="flex items-center gap-4">
												<ResolvedImage transaction={tx} />
												<span className="font-preset-5-bold">
													{tx.name}
												</span>
											</div>
											<div className="flex flex-col items-end">
												<span className="font-preset-5-bold mb-1">
													{formatCurrency(tx.amount, settings.currency)}
												</span>
												<span className="font-preset-5">
													{formatTransactionDate(tx.date)}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
