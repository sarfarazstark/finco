import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import data from '../starter-code/data.json';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

interface RawTransaction {
	avatar: string;
	name: string;
	category: string;
	date: string;
	amount: number;
	recurring: boolean;
}

interface RawBudget {
	category: string;
	maximum: number;
	theme: string;
}

interface RawPot {
	name: string;
	target: number;
	total: number;
	theme: string;
}

// ────────────────────────────────────────────────────────────────────────────────
// MAIN SEED
// ────────────────────────────────────────────────────────────────────────────────

const DEFAULT_THEMES = [
	{ name: 'Green', hex: '#277C78' },
	{ name: 'Grey', hex: '#626070' },
	{ name: 'Blue', hex: '#82C9D7' },
	{ name: 'Peach', hex: '#F2CDAC' },
	{ name: 'Purple', hex: '#826CB0' },
];

const DEFAULT_CATEGORIES = [
	'General',
	'Dining Out',
	'Groceries',
	'Entertainment',
	'Transportation',
	'Lifestyle',
	'Bills',
	'Shopping',
	'Personal Care',
	'Education',
];


async function seedMainData(userId: string) {
	console.log('🎨 Seeding themes...');
	for (const theme of DEFAULT_THEMES) {
		await prisma.theme.upsert({
			where: { userId_name: { userId, name: theme.name } },
			update: {},
			create: { userId, ...theme },
		});
	}

	console.log('📁 Seeding categories...');
	for (const name of DEFAULT_CATEGORIES) {
		await prisma.category.upsert({
			where: { userId_name: { userId, name } },
			update: {},
			create: {
				userId,
				name,
				image: `/assets/images/categories/${name.toLowerCase().replace(/ /g, '-')}.jpg`,
			},
		});
	}

	console.log('✅ Main seed complete');
}

// ────────────────────────────────────────────────────────────────────────────────
// DUMMY SEED — demo data, only for dev/staging
// ────────────────────────────────────────────────────────────────────────────────

async function seedDummyData() {
	// ── 1. Demo User ────────────────────────────────────────────────────────
	let user = await prisma.user.findUnique({
		where: { email: 'demo@finco.app' },
	});

	if (!user) {
		// Use Better Auth's API to sign up the user so password handling is correct
		const res = await auth.api.signUpEmail({
			body: {
				name: 'Demo User',
				email: 'demo@finco.app',
				password: 'Password1!',
			},
		});

		user = await prisma.user.update({
			where: { id: res.user.id },
			data: { emailVerified: true },
		});
	}
	console.log(`👤 Demo user: ${user.email} (Password: Password1!)`);

	// ── 2. Account ─────────────────────────────────────────────────
	let account = await prisma.financialAccount.findFirst({
		where: { userId: user.id, name: 'Main Checking' },
	});

	if (!account) {
		account = await prisma.financialAccount.create({
			data: { userId: user.id, name: 'Main Checking' },
		});
	}
	console.log(`🏦 Account: ${account.name}`);

	await seedMainData(user.id);

	const themes = await prisma.theme.findMany({ where: { userId: user.id } });
	const categories = await prisma.category.findMany({
		where: { userId: user.id },
	});

	const themeByHex = new Map(themes.map((t) => [t.hex, t]));
	const categoryByName = new Map(categories.map((c) => [c.name, c]));

	// ── 4. Transactions ─────────────────────────────────────────────────────
	const existingTxCount = await prisma.transaction.count({
		where: { userId: user.id },
	});

	if (existingTxCount === 0) {
		const transactions = (data.transactions as RawTransaction[]).map(
			(t) => ({
				userId: user.id,
				accountId: account.id,
				categoryId: categoryByName.get(t.category)?.id ?? null,
				name: t.name,
				amount: t.amount,
				date: new Date(t.date),
				isRecurring: t.recurring,
			}),
		);

		await prisma.transaction.createMany({ data: transactions });
		console.log(`💸 Created ${transactions.length} transactions`);
	} else {
		console.log(
			`💸 Transactions already exist (${existingTxCount}), skipping`,
		);
	}

	// ── 5. Budgets ───────────────────────────────────────────────────────────
	for (const b of data.budgets as RawBudget[]) {
		const category = categoryByName.get(b.category);
		const theme = themeByHex.get(b.theme);
		if (!category || !theme) continue;

		await prisma.budget.upsert({
			where: {
				userId_categoryId: { userId: user.id, categoryId: category.id },
			},
			update: { maximum: b.maximum, themeId: theme.id },
			create: {
				userId: user.id,
				categoryId: category.id,
				themeId: theme.id,
				maximum: b.maximum,
			},
		});
	}
	console.log(`📊 Seeded ${data.budgets.length} budgets`);

	// ── 6. Pots ──────────────────────────────────────────────────────────────
	for (const p of data.pots as RawPot[]) {
		const theme = themeByHex.get(p.theme);
		if (!theme) continue;

		const existingPot = await prisma.pot.findFirst({
			where: { userId: user.id, name: p.name },
		});

		if (!existingPot) {
			const pot = await prisma.pot.create({
				data: {
					userId: user.id,
					name: p.name,
					target: p.target,
					themeId: theme.id,
				},
			});

			if (p.total > 0) {
				await prisma.transaction.create({
					data: {
						userId: user.id,
						accountId: account.id,
						potId: pot.id,
						name: `Initial deposit – ${p.name}`,
						amount: -p.total,
						date: new Date('2024-07-01T00:00:00Z'),
						isRecurring: false,
					},
				});
			}
		}
	}
	console.log(`🏺 Seeded ${data.pots.length} pots`);

	console.log('✅ Dummy seed complete');
}

// ────────────────────────────────────────────────────────────────────────────────
// ENTRY POINT
// ────────────────────────────────────────────────────────────────────────────────

async function main() {
	console.log('🌱 Starting database seed...\n');

	const isDev = process.env.NODE_ENV !== 'production';

	if (isDev) {
		await seedDummyData();
	} else {
		console.log('⚠️  Production mode: skipping dummy data');
		console.log('   Run seedMainData(userId) after first user registers');
	}

	console.log('\n🌱 Seed finished!');
}

main()
	.catch((e) => {
		console.error('❌ Seed failed:', e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
