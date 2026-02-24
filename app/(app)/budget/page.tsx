import type { ChartData } from '@/components/charts/pie';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getSetting } from '@/hooks/use-setting';
import { AddNewBudget } from './_components/add-new-budget';
import { BudgetList } from './_components/budget-list';
import { BudgetCard } from './_components/budget-card';
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
						); // Inicio de la semana actual (domingo)
					case 'MONTHLY':
						return new Date(now.getFullYear(), now.getMonth(), 1);
					case 'QUARTERLY':
						return new Date(
							now.getFullYear(),
							Math.floor(now.getMonth() / 3) * 3,
							1
						);
					case 'YEARLY':
						return new Date(now.getFullYear(), 0, 1);
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
		<div className="p-8 max-w-6xl mx-auto">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Budget</h1>
				<AddNewBudget categories={dbCategories} themes={themes} />
			</header>

			{formattedCategories.length > 0 ? (
				<section className="flex gap-4">
					<BudgetList
						chartData={chartData}
						currency={settings.currency}
					/>
					<div className="flex-5 flex flex-col gap-4">
						{formattedCategories.map(budget => (
							<BudgetCard
								key={budget.id}
								budget={budget}
								currency={settings.currency}
								categories={dbCategories}
								themes={themes}
							/>
						))}
					</div>
				</section>
			) : (
				<div className="text-center py-16">
					<p className="font-preset-3 text-grey-500 mb-2">
						No budgets yet
					</p>
					<p className="font-preset-5 text-grey-400">
						Create a budget to start tracking your spending by
						category.
					</p>
				</div>
			)}
		</div>
	);
}
