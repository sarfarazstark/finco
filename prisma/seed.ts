// prisma/seed.ts
import { auth } from '@/lib/auth';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const ICON_DATA = [
	{ name: 'building-bank', color: 'text-indigo-600', bg: 'bg-indigo-50' },
	{ name: 'device-desktop', color: 'text-slate-600', bg: 'bg-slate-50' },
	{ name: 'star', color: 'text-amber-500', bg: 'bg-amber-50' },
	{ name: 'shopping-cart', color: 'text-violet-600', bg: 'bg-violet-50' },
	{ name: 'gift', color: 'text-pink-600', bg: 'bg-pink-50' },
	{ name: 'cash', color: 'text-emerald-700', bg: 'bg-emerald-50' },
	{ name: 'pizza', color: 'text-orange-500', bg: 'bg-orange-50' },
	{ name: 'bus', color: 'text-blue-600', bg: 'bg-blue-50' },
	{ name: 'bolt', color: 'text-yellow-600', bg: 'bg-yellow-50' },
	{ name: 'device-gamepad', color: 'text-purple-600', bg: 'bg-purple-50' },
	{ name: 'medical-cross', color: 'text-red-500', bg: 'bg-red-50' },
	{ name: 'school', color: 'text-orange-600', bg: 'bg-orange-50' },
	{ name: 'plane', color: 'text-sky-600', bg: 'bg-sky-50' },
	{ name: 'heart', color: 'text-rose-600', bg: 'bg-rose-50' },
	{ name: 'credit-card', color: 'text-gray-600', bg: 'bg-gray-50' },
	{ name: 'receipt', color: 'text-slate-500', bg: 'bg-slate-50' },
	{ name: 'movie', color: 'text-purple-500', bg: 'bg-purple-50' },
	{ name: 'power', color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

async function main() {
	// 1. User
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

	// 2. Icons
	console.log('🌱 Seeding Icons...');
	const icons: Record<string, string> = {}; // name -> id
	for (const icon of ICON_DATA) {
		const createdIcon = await prisma.icon.upsert({
			where: { name: icon.name },
			update: { color: icon.color, bg: icon.bg },
			create: icon,
		});
		icons[icon.name] = createdIcon.id;
	}

	// 3. Themes
	const themeData = [
		{ name: 'Teal', hex: '#277C78' },
		{ name: 'Light Blue', hex: '#82C9D7' },
		{ name: 'Peach', hex: '#F2CDAC' },
		{ name: 'Slate', hex: '#626070' },
		{ name: 'Purple', hex: '#826CB0' },
	];

	const themes: Record<string, string> = {}; // hex -> id
	for (const t of themeData) {
		const theme = await prisma.theme.upsert({
			where: { name: t.name },
			update: {},
			create: t,
		});
		themes[t.hex] = theme.id;
	}

	// 4. Financial Account
	const account = await prisma.financialAccount.upsert({
		where: { id: 'demo-account-id' },
		update: {},
		create: {
			id: 'demo-account-id',
			userId: user.id,
			name: 'Main Account',
			image: 'wallet',
			currency: 'USD',
		},
	});

	// 5. Categories
	const categoryData = [
		{ name: 'Salary', icon: 'building-bank' },
		{ name: 'Freelance', icon: 'device-desktop' },
		{ name: 'Investment', icon: 'star' },
		{ name: 'Food & Dining', icon: 'pizza' },
		{ name: 'Groceries', icon: 'shopping-cart' },
		{ name: 'Entertainment', icon: 'movie' },
		{ name: 'Transportation', icon: 'bus' },
		{ name: 'Bills', icon: 'power' },
		{ name: 'Personal Care', icon: 'medical-cross' },
		{ name: 'Education', icon: 'school' },
		{ name: 'Shopping', icon: 'shopping-cart' },
		{ name: 'Travel', icon: 'plane' },
		{ name: 'Other', icon: 'receipt' },
	];

	const categories: Record<string, string> = {}; // name -> id
	for (const c of categoryData) {
		const category = await prisma.category.upsert({
			where: { userId_name: { userId: user.id, name: c.name } },
			update: { iconId: icons[c.icon] },
			create: {
				userId: user.id,
				name: c.name,
				iconId: icons[c.icon] || icons['receipt'],
			},
		});
		categories[c.name] = category.id;
	}

	// 6. Transactions
	const transactions = [
		{
			name: 'Monthly Salary',
			category: 'Salary',
			date: '2024-08-19T14:23:11Z',
			amount: 5000,
			recurring: false,
		},
		{
			name: 'Savory Bites Bistro',
			category: 'Food & Dining',
			date: '2024-08-19T20:23:11Z',
			amount: -55.5,
			recurring: false,
		},
		{
			name: 'Rent Payment',
			category: 'Bills',
			date: '2024-08-18T09:45:32Z',
			amount: -1200,
			recurring: true,
		},
		{
			name: 'Amazon Purchase',
			category: 'Shopping',
			date: '2024-08-17T16:12:05Z',
			amount: -120,
			recurring: false,
		},
		{
			name: 'Uber Ride',
			category: 'Transportation',
			date: '2024-08-17T21:08:09Z',
			amount: -15,
			recurring: false,
		},
	];

	await prisma.transaction.deleteMany({ where: { userId: user.id } });
	await prisma.transaction.createMany({
		data: transactions.map(t => ({
			userId: user.id,
			accountId: account.id,
			categoryId: categories[t.category] ?? null,
			name: t.name,
			amount: t.amount,
			type:
				t.amount >= 0
					? TransactionType.INCOME
					: TransactionType.EXPENSE,
			date: new Date(t.date),
			recurring: t.recurring,
		})),
	});

	// 7. Budgets
	const budgets = [
		{ category: 'Entertainment', maximum: 50, theme: '#277C78' },
		{ category: 'Bills', maximum: 750, theme: '#82C9D7' },
		{ category: 'Food & Dining', maximum: 75, theme: '#F2CDAC' },
		{ category: 'Personal Care', maximum: 100, theme: '#626070' },
	];

	for (const b of budgets) {
		await prisma.budget.upsert({
			where: {
				userId_categoryId: {
					userId: user.id,
					categoryId: categories[b.category],
				},
			},
			update: { maximum: b.maximum, themeId: themes[b.theme] },
			create: {
				userId: user.id,
				categoryId: categories[b.category],
				maximum: b.maximum,
				themeId: themes[b.theme],
			},
		});
	}

	// 8. Pots
	const pots = [
		{ name: 'Savings', target: 2000, theme: '#277C78' },
		{ name: 'Concert Ticket', target: 150, theme: '#626070' },
		{ name: 'Gift', target: 150, theme: '#82C9D7' },
		{ name: 'New Laptop', target: 1000, theme: '#F2CDAC' },
		{ name: 'Holiday', target: 1440, theme: '#826CB0' },
	];

	for (const p of pots) {
		await prisma.pot.upsert({
			where: { userId_name: { userId: user.id, name: p.name } },
			update: { target: p.target, themeId: themes[p.theme] },
			create: {
				userId: user.id,
				name: p.name,
				target: p.target,
				themeId: themes[p.theme],
			},
		});
	}

	console.log('✅ Seed complete');
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
