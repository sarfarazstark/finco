import DonutChart from '@/components/charts/pie';
import type { ChartData } from '@/components/charts/pie';
import { IconChevronRight, IconDots } from '@tabler/icons-react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function Home() {
	const dynamicBudgetData: ChartData[] = [
		{ name: 'Teal Segment', value: 8, color: '#328281' },
		{ name: 'Blue Segment', value: 55, color: '#88cddd' },
		{ name: 'Beige Segment', value: 17, color: '#f3ceab' },
		{ name: 'Gray Segment', value: 20, color: '#60626f' },
	];

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
			},
			icon: true,
		},
	});

	const formmattedCategories = await Promise.all(
		categories.map(async (category) => {
			const spentResult = await prisma.transaction.aggregate({
				where: {
					categoryId: category.id,
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

	const chartData = formmattedCategories.map((category) => ({
		name: category.name,
		value: category.spent,
		color: category.budgets[0]?.theme?.hex || '#cccccc'
	}));

	console.log(chartData);
	return (
		<div className="p-8 max-w-5xl mx-auto">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Budget</h1>
			</header>

			<section className="flex gap-4">
				<div className="bg-white p-6 flex-3 flex flex-col gap-4 items-center rounded-xl h-fit">
					<DonutChart
						data={dynamicBudgetData}
						currentAmount={338}
						limitAmount={975}
					/>
					<div className="flex items-start flex-col w-full gap-4">
						<h2 className="font-preset-3 font-semibold">
							Spending Summary
						</h2>
						<ul className="flex items-start gap-2 w-full">
							<li className="flex gap-4 items-center w-full p-1">
								<hr
									className="h-6 w-1 border-none rounded-full"
									style={{ background: '#328281' }}
								/>
								<p className="font-preset-4">Entertainment</p>
								<span className="flex items-center gap-2 ml-auto">
									<p className="font-preset-4-bold text-gray-900">
										$15.00
									</p>
									<p className="text-gray-500 font-preset-5 tracking-widest">
										of $50.00
									</p>
								</span>
							</li>
						</ul>
					</div>
				</div>
				<div className="flex-5">
					<div className="w-full bg-white rounded-xl p-8">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-4">
								<div className="w-4 h-4 rounded-full bg-[#277C78]"></div>
								<h2 className="font-preset-3 font-semibold">
									Entertainment
								</h2>
							</div>
							<button className="text-grey-500 hover:text-[#202226] transition-colors">
								<IconDots />
							</button>
						</div>

						<div className="mb-6">
							<p className="font-preset-5 mb-4">
								Maximum of $50.00
							</p>
							<div className="w-full h-8 bg-[#F8F4F0] rounded p-1">
								<div className="h-full rounded-sm bg-[#277C78] w-[30%]"></div>
							</div>
						</div>

						<div className="flex mb-8 mt-6">
							<div className="flex w-1/2 items-start gap-4">
								<div className="w-1 h-11 rounded-full bg-[#277C78]"></div>
								<div className="flex flex-col">
									<p className="font-preset-5 mb-1">Spent</p>
									<p className="font-preset-5-bold">$15.00</p>
								</div>
							</div>

							<div className="flex w-1/2 items-start gap-4">
								<div className="w-1 h-11 rounded-full bg-[#F8F4F0]"></div>
								<div className="flex flex-col">
									<p className="font-preset-5 mb-1">
										Remaining
									</p>
									<p className="font-preset-5-bold">$35.00</p>
								</div>
							</div>
						</div>

						<div className="bg-[#F8F4F0] rounded-xl p-5">
							<div className="flex justify-between items-center mb-5">
								<h3 className="font-preset-3 font-semibold">
									Latest Spending
								</h3>
								<button className="flex items-center gap-2 text-[14px] text-grey-500 hover:text-[#202226] transition-colors">
									See All
									<IconChevronRight />
								</button>
							</div>

							<div className="flex flex-col">
								<div className="flex items-center justify-between py-3 border-b border-[#E0DEDC]">
									<div className="flex items-center gap-4">
										<Image
											width={150}
											height={150}
											src="/assets/images/avatars/daniel-carter.jpg"
											alt="James Thompson"
											className="w-8 h-8 rounded-full object-cover"
										/>
										<span className="font-preset-5-bold">
											James Thompson
										</span>
									</div>
									<div className="flex flex-col items-end">
										<span className="font-preset-5-bold mb-1">
											-$5.00
										</span>
										<span className="font-preset-5">
											11 Aug 2024
										</span>
									</div>
								</div>

								<div className="flex items-center justify-between py-3 border-b border-[#E0DEDC]">
									<div className="flex items-center gap-4">
										<div className="w-8 h-8 rounded-full bg-[#826CB0] flex items-center justify-center">
											<Image
												width={150}
												height={150}
												src="/assets/images/avatars/daniel-carter.jpg"
												alt="Rina Sato"
												className="w-8 h-8 rounded-full object-cover"
											/>
										</div>
										<span className="font-preset-5-bold">
											Pixel Playground
										</span>
									</div>
									<div className="flex flex-col items-end">
										<span className="font-preset-5-bold mb-1">
											-$10.00
										</span>
										<span className="font-preset-5">
											11 Aug 2024
										</span>
									</div>
								</div>

								<div className="flex items-center justify-between py-3">
									<div className="flex items-center gap-4">
										<Image
											width={150}
											height={150}
											src="/assets/images/avatars/daniel-carter.jpg"
											alt="Rina Sato"
											className="w-8 h-8 rounded-full object-cover"
										/>
										<span className="font-preset-5-bold">
											Rina Sato
										</span>
									</div>
									<div className="flex flex-col items-end">
										<span className="font-preset-5-bold mb-1">
											-$10.00
										</span>
										<span className="font-preset-5">
											13 Jul 2024
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
