import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import data from '../starter-code/data.json';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

// ─── Raw data shapes ──────────────────────────────────────────────────
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

// ──────────────────────────────────────────────────────────────────────
async function seedDummyData() {
	// 1. Create User
	let user = await prisma.user.findUnique({
		where: { email: 'demo@finco.app' },
	});
	if (!user) {
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
	console.log(`👤 Demo user created/found: ${user.email}`);

	// 2. Create Account (User-Defined)
	let account = await prisma.financialAccount.findFirst({
		where: { userId: user.id, name: 'Main Checking' },
	});
	if (!account) {
		account = await prisma.financialAccount.create({
			data: {
				userId: user.id,
				name: 'Main Checking',
				image: '/assets/images/icon-nav-overview.svg', // generic icon
				currency: 'INR',
			},
		});
	}
	console.log(`🏦 Account created/found: ${account.name}`);

	// 3. Create Themes
	const uniqueThemes = new Set<string>();
	data.budgets.forEach(b => uniqueThemes.add(b.theme));
	data.pots.forEach(p => uniqueThemes.add(p.theme));

	console.log(`🎨 Seeding ${uniqueThemes.size} themes...`);
	const themeMap = new Map<string, string>(); // hex -> themeId
	let i = 1;
	for (const hex of uniqueThemes) {
		let theme = await prisma.theme.findFirst({ where: { hex } });
		if (!theme) {
			theme = await prisma.theme.create({
				data: { name: `Theme ${i++}`, hex },
			});
		}
		themeMap.set(hex, theme.id);
	}

	// 4. Create Categories
	const uniqueCategories = new Set<string>();
	data.transactions.forEach(t => uniqueCategories.add(t.category));

	console.log(`📁 Seeding ${uniqueCategories.size} categories...`);
	const categoryMap = new Map<string, string>(); // name -> categoryId
	for (const name of uniqueCategories) {
		const slug = name.toLowerCase().replace(/ /g, '-');
		let cat = await prisma.category.findUnique({
			where: { userId_name: { userId: user.id, name } },
		});
		if (!cat) {
			cat = await prisma.category.create({
				data: {
					userId: user.id,
					name,
					image: `/assets/images/avatars/${slug}.jpg`,
				},
			});
		}
		categoryMap.set(name, cat.id);
	}

	// 5. Create Budgets
	console.log(`📊 Seeding ${data.budgets.length} budgets...`);
	for (const b of data.budgets as RawBudget[]) {
		const categoryId = categoryMap.get(b.category)!;
		const themeId = themeMap.get(b.theme)!;

		await prisma.budget.upsert({
			where: { userId_categoryId: { userId: user.id, categoryId } },
			update: { maximum: b.maximum, themeId },
			create: {
				userId: user.id,
				categoryId,
				maximum: b.maximum,
				themeId,
			},
		});
	}

	// 6. Create Pots
	console.log(`🏺 Seeding ${data.pots.length} pots...`);
	const potMap = new Map<string, string>(); // name -> potId
	for (const p of data.pots as RawPot[]) {
		const themeId = themeMap.get(p.theme)!;

		const pot = await prisma.pot.upsert({
			where: { userId_name: { userId: user.id, name: p.name } },
			update: { target: p.target, themeId },
			create: {
				userId: user.id,
				name: p.name,
				target: p.target,
				themeId,
			},
		});
		potMap.set(p.name, pot.id);
	}

	// 7. Create Transactions (Source of Truth)
	const existingTx = await prisma.transaction.count({
		where: { userId: user.id, type: { in: ['INCOME', 'EXPENSE'] } },
	});
	if (existingTx === 0) {
		console.log(`💸 Seeding ${data.transactions.length} transactions...`);
		for (const raw of data.transactions as RawTransaction[]) {
			const type = raw.amount >= 0 ? 'INCOME' : 'EXPENSE';
			const categoryId = categoryMap.get(raw.category);

			await prisma.transaction.create({
				data: {
					userId: user.id,
					accountId: account.id,
					categoryId,
					name: raw.name,
					amount: Math.abs(raw.amount), // Amount is absolute, sign is inferred by type
					type,
					date: new Date(raw.date),
					recurring: raw.recurring,
					image: raw.avatar, // Explicit override provided by JSON
				},
			});
		}
	} else {
		console.log(`💸 Transactions already seeded, skipping.`);
	}

	console.log('✅ Dummy seed complete!');
}

async function main() {
  console.log('🌱 Starting database seed...\n');
  if (process.env.NODE_ENV !== 'production') {
		await seedDummyData();
  } else {
		console.log('⚠️ Production: skipping dummy data');
  }
  console.log('\n🌱 Seed finished!');
}

main()
	.catch(e => {
		console.error('❌ Seed failed:', e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
