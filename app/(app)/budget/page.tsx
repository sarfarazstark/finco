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
import { AddNewBudget } from './_components/add-new-budget';
import { BudgetType } from '@prisma/client';

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
			icon: true,
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
		categories.map(async category => {
			const type = category.budgets[0]?.type || 'MONTHLY';

			const getStartDate = (period: BudgetType) => {
				const now = new Date();
				switch (period) {
					case 'WEEKLY':
						return new Date(
							now.setDate(now.getDate() - now.getDay())
						); // Start of current week (Sunday)
					case 'MONTHLY':
						return new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
					case 'QUARTERLY':
						return new Date(
							now.getFullYear(),
							Math.floor(now.getMonth() / 3) * 3,
							1
						); // Start of current quarter
					case 'YEARLY':
						return new Date(now.getFullYear(), 0, 1); // Start of current year
					default:
						return new Date(now.getFullYear(), now.getMonth(), 1);
				}
			};

			const startDate = getStartDate(type);

			const spentResult = await prisma.transaction.aggregate({
				where: {
					categoryId: category.id,
					createdAt: {
						gte: startDate,
					},
				},
				_sum: {
					amount: true,
				},
			});

			return {
				...category,
				spent: Number(spentResult._sum.amount || 0),
				startDate,
			};
		})
	);

	const chartData: ChartData[] = formattedCategories.map(category => ({
		name: category.name,
		value: Math.abs(category.spent),
		limit: category.budgets[0]?.maximum || 0,
		color: category.budgets[0]?.theme?.hex || '#cccccc',
	}));

	const settings = await getSetting(session.user.id);

	const dbCategories = await prisma.category.findMany({
		where: {
			userId: session.user.id,
		},
		select: {
			id: true,
			name: true,
			icon: true,
		},
	});

	const themes = await prisma.theme.findMany();

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Budget</h1>
				<AddNewBudget categories={dbCategories} themes={themes} />
			</header>

			<section className="flex gap-4">
				<div className="bg-white p-6 flex-3 flex flex-col gap-4 items-center rounded-xl h-fit">
					<DonutChart data={chartData} currency={settings.currency} />
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
											{formatCurrency(
												data.value,
												settings.currency
											)}
										</p>
										<p className="text-gray-500 font-preset-5 tracking-widest">
											of{' '}
											{formatCurrency(
												data.limit,
												settings.currency
											)}
										</p>
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="flex-5 flex flex-col gap-4">
					{formattedCategories.map(budget => (
						<div
							key={budget.id}
							className="w-full bg-white rounded-xl p-8"
						>
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-4">
									<div
										className="w-4 h-4 rounded-full"
										style={{
											background:
												budget.budgets[0]?.theme?.hex ||
												'#cccccc',
										}}
									></div>
									<h2 className="font-preset-3 font-semibold">
										{budget.name}
									</h2>
								</div>
								<BudgetActions
									category={{
										id: budget.id,
										name: budget.name,
										budgets: budget.budgets,
										icon: budget.icon,
									}}
									categories={dbCategories}
									themes={themes}
								/>
							</div>

							<div className="mb-6">
								<p className="font-preset-5 mb-4 text-grey-500">
									Maximum of{' '}
									{formatCurrency(
										budget.budgets[0]?.maximum || 0,
										settings.currency
									)}
								</p>
								<div className="w-full h-8 bg-[#F8F4F0] rounded p-1 flex">
									{/* Safe Segment (capped at 100%) */}
									<div
										className="h-full rounded-sm transition-all duration-300"
										style={{
											width:
												Math.abs(budget.spent) >
												(budget.budgets[0]?.maximum ||
													0)
													? `${((budget.budgets[0]?.maximum || 0) / Math.abs(budget.spent)) * 100}%`
													: `${Math.min((Math.abs(budget.spent) / (budget.budgets[0]?.maximum || 1)) * 100, 100)}%`,
											background:
												budget.budgets[0]?.theme?.hex ||
												'#cccccc',
										}}
									></div>
									{Math.abs(budget.spent) >
										(budget.budgets[0]?.maximum || 0) && (
										<div
											className="h-full rounded-sm ml-1 transition-all duration-300 relative overflow-hidden"
											style={{
												width: `${((Math.abs(budget.spent) - (budget.budgets[0]?.maximum || 0)) / Math.abs(budget.spent)) * 100}%`,
											}}
										>
											<svg
												width="100%"
												height="100%"
												className="absolute inset-0"
											>
												<defs>
													<pattern
														id={`overspent-list-${budget.id}`}
														width="10"
														height="10"
														patternUnits="userSpaceOnUse"
														patternTransform="rotate(130)"
													>
														<rect
															width="10"
															height="10"
															fill="#F8F4F0"
														></rect>
														<line
															x1="0"
															y1="0"
															x2="0"
															y2="10"
															stroke="#C94736"
															strokeWidth="2"
															opacity="0.5"
														></line>
													</pattern>
												</defs>
												<rect
													width="100%"
													height="100%"
													fill={`url(#overspent-list-${budget.id})`}
												></rect>
											</svg>
										</div>
									)}
								</div>
							</div>

							<div className="flex mb-8 mt-6">
								<div className="flex w-1/2 items-start gap-4">
									<div
										className="w-1 h-11 rounded-full"
										style={{
											background:
												budget.budgets[0]?.theme?.hex ||
												'#cccccc',
										}}
									></div>
									<div className="flex flex-col">
										<p className="font-preset-5 mb-1 text-grey-500">
											Spent{' '}
											<span className="text-xs tracking-tight">
												(
												{formatTransactionDate(
													budget.startDate
												)}
												)
											</span>
										</p>
										<p className="font-preset-5-bold text-grey-900">
											{formatCurrency(
												Math.abs(budget.spent),
												settings.currency
											)}
										</p>
									</div>
								</div>

								<div className="flex w-1/2 items-start gap-4">
									<div className="w-1 h-11 rounded-full bg-[#F8F4F0]"></div>
									<div className="flex flex-col">
										<p className="font-preset-5 mb-1 text-grey-500">
											Remaining
										</p>
										<p className="font-preset-5-bold text-grey-900">
											{formatCurrency(
												Math.abs(
													budget.budgets[0]
														?.maximum || 0
												) - Math.abs(budget.spent),
												settings.currency
											)}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-[#F8F4F0] rounded-xl p-5">
								<div className="flex justify-between items-center mb-5">
									<h3 className="font-preset-3 font-semibold">
										Latest Spending
									</h3>
									<Link
										href={`/transactions?category=${encodeURIComponent(budget.name)}`}
										className="flex items-center gap-2 text-[14px] text-grey-500 hover:text-[#202226] transition-colors"
									>
										See All
										<IconChevronRight />
									</Link>
								</div>

								<div className="flex flex-col">
									{budget.transactions.map((tx, index) => (
										<div
											key={tx.id}
											className={`flex items-center justify-between py-3 ${index === budget.transactions.length - 1 ? 'border-none' : 'border-b border-[#E0DEDC]'}`}
										>
											<div className="flex items-center gap-4">
												<ResolvedImage
													transaction={tx}
												/>
												<span className="font-preset-5-bold">
													{tx.name}
												</span>
											</div>
											<div className="flex flex-col items-end">
												<span className="font-preset-5-bold mb-1">
													{formatCurrency(
														tx.amount,
														settings.currency
													)}
												</span>
												<span className="font-preset-5">
													{formatTransactionDate(
														tx.date
													)}
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
