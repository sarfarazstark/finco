import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getSetting } from '@/hooks/use-setting';
import { AddNewPot } from './_components/add-new-pot';
import { PotCard } from './_components/pot-card';

export default async function PotsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return redirect('/auth/login');
	}

	const pots = await prisma.pot.findMany({
		where: { userId: session.user.id },
		include: { theme: true },
		orderBy: { createdAt: 'desc' },
	});

	const settings = await getSetting(session.user.id);
	const themes = await prisma.theme.findMany();

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<header className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">Pots</h1>
				<AddNewPot themes={themes} />
			</header>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{pots.map(pot => (
					<PotCard
						key={pot.id}
						pot={pot}
						currency={settings.currency}
						themes={themes}
					/>
				))}
			</div>

			{pots.length === 0 && (
				<div className="text-center py-16">
					<p className="font-preset-3 text-grey-500 mb-2">
						No pots yet
					</p>
					<p className="font-preset-5 text-grey-400">
						Create a pot to start saving towards your goals.
					</p>
				</div>
			)}
		</div>
	);
}
