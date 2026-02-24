// prisma/seed.ts
import { auth } from '@/lib/auth';
import { PrismaPg } from '@prisma/adapter-pg';
import { BudgetType, PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const ICON_DATA = [
	{ name: 'building-bank', color: 'bg-indigo-600' },
	{ name: 'device-desktop', color: 'bg-slate-600' },
	{ name: 'star', color: 'bg-amber-500' },
	{ name: 'shopping-cart', color: 'bg-violet-600' },
	{ name: 'gift', color: 'bg-pink-600' },
	{ name: 'cash', color: 'bg-emerald-700' },
	{ name: 'pizza', color: 'bg-orange-500' },
	{ name: 'bus', color: 'bg-blue-600' },
	{ name: 'bolt', color: 'bg-yellow-600' },
	{ name: 'device-gamepad', color: 'bg-purple-600' },
	{ name: 'medical-cross', color: 'bg-red-500' },
	{ name: 'school', color: 'bg-orange-600' },
	{ name: 'plane', color: 'bg-sky-600' },
	{ name: 'heart', color: 'bg-rose-600' },
	{ name: 'credit-card', color: 'bg-gray-600' },
	{ name: 'receipt', color: 'bg-slate-500' },
	{ name: 'movie', color: 'bg-purple-500' },
	{ name: 'power', color: 'bg-yellow-500' },
	{ name: 'home', color: 'bg-teal-600' },
	{ name: 'car', color: 'bg-cyan-600' },
	{ name: 'briefcase', color: 'bg-blue-700' },
	{ name: 'chart-bar', color: 'bg-green-600' },
	{ name: 'coin', color: 'bg-amber-600' },
	{ name: 'wallet', color: 'bg-emerald-600' },
	{ name: 'pig-money', color: 'bg-pink-500' },
	{ name: 'stethoscope', color: 'bg-red-600' },
	{ name: 'barbell', color: 'bg-lime-600' },
	{ name: 'shirt', color: 'bg-fuchsia-600' },
	{ name: 'device-mobile', color: 'bg-slate-700' },
	{ name: 'wifi', color: 'bg-blue-500' },
	{ name: 'droplet', color: 'bg-cyan-500' },
	{ name: 'tree', color: 'bg-green-700' },
	{ name: 'paw', color: 'bg-orange-400' },
	{ name: 'tool', color: 'bg-gray-700' },
	{ name: 'music', color: 'bg-violet-500' },
	{ name: 'book', color: 'bg-indigo-500' },
	{ name: 'camera', color: 'bg-rose-500' },
	{ name: 'baby-carriage', color: 'bg-pink-400' },
	{ name: 'beach', color: 'bg-yellow-500' },
	{ name: 'building', color: 'bg-zinc-600' },
	{ name: 'vaccine', color: 'bg-red-400' },
	{ name: 'antenna', color: 'bg-sky-500' },
	{ name: 'gas-station', color: 'bg-stone-600' },
	{ name: 'smoking', color: 'bg-neutral-500' },
	{ name: 'glass-full', color: 'bg-teal-500' },
	{ name: 'printer', color: 'bg-gray-500' },
	{ name: 'calendar-repeat', color: 'bg-purple-700' },
	{ name: 'category', color: 'bg-indigo-400' },
	{ name: 'salad', color: 'bg-green-500' },
	{ name: 'coffee', color: 'bg-amber-700' },
	{ name: 'cake', color: 'bg-pink-400' },
	{ name: 'meat', color: 'bg-red-400' },
	{ name: 'bottle', color: 'bg-lime-500' },
	{ name: 'bike', color: 'bg-cyan-700' },
	{ name: 'train', color: 'bg-blue-800' },
	{ name: 'ship', color: 'bg-sky-700' },
	{ name: 'motorbike', color: 'bg-orange-700' },
	{ name: 'road', color: 'bg-stone-500' },
	{ name: 'helicopter', color: 'bg-slate-600' },
	{ name: 'ball-tennis', color: 'bg-yellow-600' },
	{ name: 'swimming', color: 'bg-blue-400' },
	{ name: 'run', color: 'bg-green-600' },
	{ name: 'ball-football', color: 'bg-emerald-500' },
	{ name: 'ball-basketball', color: 'bg-orange-500' },
	{ name: 'yoga', color: 'bg-violet-400' },
	{ name: 'microscope', color: 'bg-teal-700' },
	{ name: 'flask', color: 'bg-purple-400' },
	{ name: 'certificate', color: 'bg-amber-500' },
	{ name: 'pencil', color: 'bg-yellow-700' },
	{ name: 'clipboard', color: 'bg-indigo-400' },
	{ name: 'device-tv', color: 'bg-slate-500' },
	{ name: 'headphones', color: 'bg-fuchsia-500' },
	{ name: 'dice', color: 'bg-rose-400' },
	{ name: 'puzzle', color: 'bg-indigo-500' },
	{ name: 'brush', color: 'bg-pink-600' },
	{ name: 'needle-thread', color: 'bg-violet-600' },
	{ name: 'garden-cart', color: 'bg-green-700' },
	{ name: 'hammer', color: 'bg-stone-600' },
	{ name: 'axe', color: 'bg-red-700' },
	{ name: 'bulb', color: 'bg-yellow-400' },
	{ name: 'solar-panel', color: 'bg-amber-400' },
	{ name: 'recycle', color: 'bg-green-500' },
	{ name: 'snowflake', color: 'bg-sky-400' },
	{ name: 'sun', color: 'bg-orange-400' },
	{ name: 'moon', color: 'bg-indigo-300' },
	{ name: 'umbrella', color: 'bg-blue-500' },
	{ name: 'first-aid-kit', color: 'bg-red-500' },
	{ name: 'pill', color: 'bg-rose-500' },
	{ name: 'dental', color: 'bg-cyan-500' },
	{ name: 'eye', color: 'bg-teal-500' },
	{ name: 'building-hospital', color: 'bg-red-600' },
	{ name: 'currency-dollar', color: 'bg-green-600' },
	{ name: 'currency-euro', color: 'bg-blue-600' },
	{ name: 'currency-bitcoin', color: 'bg-orange-500' },
	{ name: 'chart-line', color: 'bg-emerald-600' },
	{ name: 'chart-pie', color: 'bg-violet-500' },
	{ name: 'building-store', color: 'bg-fuchsia-600' },
	{ name: 'hanger', color: 'bg-pink-500' },
	{ name: 'shoe', color: 'bg-amber-600' },
	{ name: 'diamond', color: 'bg-cyan-600' },
	{ name: 'device-watch', color: 'bg-slate-700' },
	{ name: 'backpack', color: 'bg-orange-600' },
	{ name: 'map-pin', color: 'bg-rose-600' },
	{ name: 'world', color: 'bg-sky-500' },
	{ name: 'hotel-service', color: 'bg-indigo-600' },
	{ name: 'tent', color: 'bg-lime-600' },
	{ name: 'rollercoaster', color: 'bg-purple-600' },
	{ name: 'artboard', color: 'bg-fuchsia-700' },
	{ name: 'augmented-reality', color: 'bg-cyan-700' },
	{ name: 'badge', color: 'bg-amber-500' },
	{ name: 'balloon', color: 'bg-pink-500' },
	{ name: 'bath', color: 'bg-sky-500' },
	{ name: 'bed', color: 'bg-indigo-400' },
	{ name: 'beer', color: 'bg-yellow-600' },
	{ name: 'bell', color: 'bg-orange-400' },
	{ name: 'bible', color: 'bg-stone-500' },
	{ name: 'bike-off', color: 'bg-red-400' },
	{ name: 'pool', color: 'bg-green-700' },
	{ name: 'brand-netflix', color: 'bg-red-600' },
	{ name: 'brand-spotify', color: 'bg-green-500' },
	{ name: 'brand-youtube', color: 'bg-red-500' },
	{ name: 'brand-twitch', color: 'bg-purple-600' },
	{ name: 'brand-apple', color: 'bg-gray-700' },
	{ name: 'brand-google-play', color: 'bg-green-600' },
	{ name: 'brand-amazon', color: 'bg-amber-600' },
	{ name: 'brand-paypal', color: 'bg-blue-700' },
	{ name: 'building-church', color: 'bg-stone-600' },
	{ name: 'building-cottage', color: 'bg-lime-700' },
	{ name: 'building-factory', color: 'bg-zinc-600' },
	{ name: 'building-skyscraper', color: 'bg-slate-600' },
	{ name: 'calendar-event', color: 'bg-rose-500' },
	{ name: 'candle', color: 'bg-amber-400' },
	{ name: 'candy', color: 'bg-pink-400' },
	{ name: 'chess', color: 'bg-neutral-600' },
	{ name: 'christmas-tree', color: 'bg-green-700' },
	{ name: 'cpu', color: 'bg-teal-600' },
	{ name: 'clock', color: 'bg-blue-500' },
	{ name: 'cloud', color: 'bg-sky-400' },
	{ name: 'confetti', color: 'bg-fuchsia-500' },
	{ name: 'contrast', color: 'bg-gray-600' },
	{ name: 'cookie', color: 'bg-amber-700' },
	{ name: 'crown', color: 'bg-yellow-500' },
	{ name: 'cup', color: 'bg-orange-500' },
	{ name: 'desk', color: 'bg-slate-500' },
	{ name: 'dog', color: 'bg-orange-400' },
	{ name: 'drone', color: 'bg-cyan-600' },
	{ name: 'egg', color: 'bg-yellow-400' },
	{ name: 'escalator-up', color: 'bg-blue-400' },
	{ name: 'feather', color: 'bg-lime-500' },
	{ name: 'file-invoice', color: 'bg-indigo-500' },
	{ name: 'fish', color: 'bg-teal-400' },
	{ name: 'flame', color: 'bg-red-500' },
	{ name: 'flower', color: 'bg-rose-400' },
	{ name: 'focus', color: 'bg-violet-400' },
	{ name: 'forklift', color: 'bg-stone-600' },
	{ name: 'friends', color: 'bg-emerald-500' },
	{ name: 'ghost', color: 'bg-purple-400' },
	{ name: 'grill', color: 'bg-orange-600' },
	{ name: 'horse-toy', color: 'bg-amber-500' },
	{ name: 'ice-cream', color: 'bg-pink-300' },
	{ name: 'ironing', color: 'bg-blue-300' },
	{ name: 'jetpack', color: 'bg-cyan-500' },
	{ name: 'kayak', color: 'bg-sky-600' },
	{ name: 'wind', color: 'bg-fuchsia-400' },
	{ name: 'ladder', color: 'bg-zinc-500' },
	{ name: 'lamp', color: 'bg-yellow-500' },
	{ name: 'leaf', color: 'bg-green-500' },
	{ name: 'lego', color: 'bg-red-400' },
	{ name: 'lifebuoy', color: 'bg-orange-500' },
	{ name: 'luggage', color: 'bg-indigo-500' },
	{ name: 'macro', color: 'bg-emerald-400' },
	{ name: 'massage', color: 'bg-rose-500' },
	{ name: 'milk', color: 'bg-blue-200' },
	{ name: 'moped', color: 'bg-teal-500' },
	{ name: 'mountain', color: 'bg-stone-500' },
	{ name: 'mushroom', color: 'bg-amber-600' },
	{ name: 'diamond', color: 'bg-fuchsia-600' },
	{ name: 'notebook', color: 'bg-violet-500' },
	{ name: 'pacman', color: 'bg-yellow-400' },
	{ name: 'parachute', color: 'bg-sky-500' },
	{ name: 'parking', color: 'bg-blue-600' },
	{ name: 'pennant', color: 'bg-red-500' },
	{ name: 'phone-call', color: 'bg-green-600' },
	{ name: 'photo', color: 'bg-rose-400' },
	{ name: 'plant', color: 'bg-lime-600' },
	{ name: 'pool', color: 'bg-cyan-400' },
	{ name: 'bucket', color: 'bg-yellow-500' },
	{ name: 'tools-kitchen-2', color: 'bg-orange-700' },
	{ name: 'robot', color: 'bg-slate-600' },
	{ name: 'rocket', color: 'bg-indigo-600' },
	{ name: 'christmas-tree', color: 'bg-red-600' },
	{ name: 'scooter', color: 'bg-teal-600' },
	{ name: 'seeding', color: 'bg-green-400' },
	{ name: 'shield', color: 'bg-blue-700' },
	{ name: 'skateboard', color: 'bg-orange-500' },
	{ name: 'slice', color: 'bg-amber-500' },
	{ name: 'sofa', color: 'bg-violet-600' },
	{ name: 'soup', color: 'bg-orange-400' },
	{ name: 'sparkles', color: 'bg-yellow-400' },
	{ name: 'speakerphone', color: 'bg-purple-500' },
	{ name: 'spray', color: 'bg-cyan-500' },
	{ name: 'swords', color: 'bg-red-700' },
	{ name: 'tir', color: 'bg-zinc-600' },
	{ name: 'trophy', color: 'bg-amber-500' },
	{ name: 'trowel', color: 'bg-stone-500' },
	{ name: 'ufo', color: 'bg-green-400' },
	{ name: 'universe', color: 'bg-indigo-400' },
	{ name: 'urgent', color: 'bg-red-600' },
	{ name: 'usb', color: 'bg-slate-500' },
	{ name: 'amphora', color: 'bg-rose-400' },
	{ name: 'venus', color: 'bg-pink-500' },
	{ name: 'video', color: 'bg-violet-500' },
	{ name: 'virus', color: 'bg-red-400' },
	{ name: 'volcano', color: 'bg-orange-700' },
	{ name: 'wash-machine', color: 'bg-blue-400' },
	{ name: 'wave-saw-tool', color: 'bg-teal-500' },
	{ name: 'windmill', color: 'bg-lime-500' },
	{ name: 'wood', color: 'bg-amber-800' },
	{ name: 'world-dollar', color: 'bg-emerald-600' },
	{ name: 'writing', color: 'bg-indigo-500' },
	{ name: 'xbox-a', color: 'bg-green-600' },
	{ name: 'yin-yang', color: 'bg-neutral-700' },
	{ name: 'zodiac-aquarius', color: 'bg-sky-500' },
	{ name: 'zoom-money', color: 'bg-emerald-500' },
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
			update: { color: icon.color },
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
			image: '/assets/images/avatars/default.jpg',
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
		{ name: 'Shopping', icon: 'shopping-bag' },
		{ name: 'Travel', icon: 'plane' },
		{ name: 'Lifestyle', icon: 'heart' },
		{ name: 'General', icon: 'category' },
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
			name: 'Emma Richardson',
			category: 'General',
			date: '2024-08-19T14:23:11Z',
			amount: 75.5,
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
			name: 'Daniel Carter',
			category: 'General',
			date: '2024-08-18T09:45:32Z',
			amount: -42.3,
			recurring: false,
		},
		{
			name: 'Sun Park',
			category: 'General',
			date: '2024-08-17T16:12:05Z',
			amount: 120.0,
			recurring: false,
		},
		{
			name: 'Urban Services Hub',
			category: 'General',
			date: '2024-08-17T21:08:09Z',
			amount: -65.0,
			recurring: false,
		},
		{
			name: 'Liam Hughes',
			category: 'Groceries',
			date: '2024-08-15T18:20:33Z',
			amount: 65.75,
			recurring: false,
		},
		{
			name: 'Lily Ramirez',
			category: 'General',
			date: '2024-08-14T13:05:27Z',
			amount: 50.0,
			recurring: false,
		},
		{
			name: 'Ethan Clark',
			category: 'Food & Dining',
			date: '2024-08-13T20:15:59Z',
			amount: -32.5,
			recurring: false,
		},
		{
			name: 'James Thompson',
			category: 'Entertainment',
			date: '2024-08-11T15:45:38Z',
			amount: -5.0,
			recurring: false,
		},
		{
			name: 'Pixel Playground',
			category: 'Entertainment',
			date: '2024-08-11T18:45:38Z',
			amount: -10.0,
			recurring: true,
			frequency: 30,
		},
		{
			name: 'Ella Phillips',
			category: 'Food & Dining',
			date: '2024-08-10T19:22:51Z',
			amount: -45.0,
			recurring: false,
		},
		{
			name: 'Sofia Peterson',
			category: 'Transportation',
			date: '2024-08-08T08:55:17Z',
			amount: -15.0,
			recurring: false,
		},
		{
			name: 'Mason Martinez',
			category: 'Lifestyle',
			date: '2024-08-07T17:40:29Z',
			amount: -35.25,
			recurring: false,
		},
		{
			name: 'Green Plate Eatery',
			category: 'Groceries',
			date: '2024-08-06T08:25:44Z',
			amount: -78.5,
			recurring: false,
		},
		{
			name: 'Sebastian Cook',
			category: 'Transportation',
			date: '2024-08-06T10:05:44Z',
			amount: -22.5,
			recurring: false,
		},
		{
			name: 'William Harris',
			category: 'Personal Care',
			date: '2024-08-05T14:30:56Z',
			amount: -10.0,
			recurring: false,
		},
		{
			name: 'Elevate Education',
			category: 'Education',
			date: '2024-08-04T11:15:22Z',
			amount: -50.0,
			recurring: true,
			frequency: 30,
		},
		{
			name: 'Serenity Spa & Wellness',
			category: 'Personal Care',
			date: '2024-08-03T14:00:37Z',
			amount: -30.0,
			recurring: true,
			frequency: 30,
		},
		{
			name: 'Spark Electric Solutions',
			category: 'Bills',
			date: '2024-08-02T09:25:11Z',
			amount: -100.0,
			recurring: true,
			frequency: 30,
		},
		{
			name: 'Rina Sato',
			category: 'Bills',
			date: '2024-08-02T13:31:11Z',
			amount: -50.0,
			recurring: false,
		},
		{
			name: 'Swift Ride Share',
			category: 'Transportation',
			date: '2024-08-01T18:40:33Z',
			amount: -18.75,
			recurring: false,
		},
		{
			name: 'Aqua Flow Utilities',
			category: 'Bills',
			date: '2024-07-30T13:20:14Z',
			amount: -100.0,
			recurring: true,
			frequency: 30,
		},
		{
			name: 'EcoFuel Energy',
			category: 'Bills',
			date: '2024-07-29T11:55:29Z',
			amount: -35.0,
			recurring: true,
			frequency: 30,
		},
		{
			name: 'Yuna Kim',
			category: 'Food & Dining',
			date: '2024-07-29T13:51:29Z',
			amount: -28.5,
			recurring: false,
		},
		{
			name: 'Flavor Fiesta',
			category: 'Food & Dining',
			date: '2024-07-27T20:15:06Z',
			amount: -42.75,
			recurring: false,
		},
		{
			name: 'Harper Edwards',
			category: 'Shopping',
			date: '2024-07-26T09:43:23Z',
			amount: -89.99,
			recurring: false,
		},
		{
			name: 'Buzz Marketing Group',
			category: 'General',
			date: '2024-07-26T14:40:23Z',
			amount: 3358.0,
			recurring: false,
		},
		{
			name: 'TechNova Innovations',
			category: 'Shopping',
			date: '2024-07-25T16:25:37Z',
			amount: -29.99,
			recurring: false,
		},
		{
			name: 'ByteWise',
			category: 'Lifestyle',
			date: '2024-07-23T09:35:14Z',
			amount: -49.99,
			recurring: true,
			frequency: 30,
		},
		{
			name: 'Nimbus Data Storage',
			category: 'Bills',
			date: '2024-07-21T10:05:42Z',
			amount: -9.99,
			recurring: true,
			frequency: 30,
		},
		{
			name: 'Emma Richardson',
			category: 'General',
			date: '2024-07-20T17:30:55Z',
			amount: -25.0,
			recurring: false,
		},
		{
			name: 'Daniel Carter',
			category: 'General',
			date: '2024-07-19T12:45:09Z',
			amount: 50.0,
			recurring: false,
		},
		{
			name: 'Sun Park',
			category: 'General',
			date: '2024-07-18T19:20:23Z',
			amount: -38.5,
			recurring: false,
		},
		{
			name: 'Harper Edwards',
			category: 'Shopping',
			date: '2024-07-17T14:55:37Z',
			amount: -29.99,
			recurring: false,
		},
		{
			name: 'Liam Hughes',
			category: 'Groceries',
			date: '2024-07-16T10:10:51Z',
			amount: -52.75,
			recurring: false,
		},
		{
			name: 'Lily Ramirez',
			category: 'General',
			date: '2024-07-15T16:35:04Z',
			amount: 75.0,
			recurring: false,
		},
		{
			name: 'Ethan Clark',
			category: 'Food & Dining',
			date: '2024-07-14T20:50:18Z',
			amount: -41.25,
			recurring: false,
		},
		{
			name: 'Rina Sato',
			category: 'Entertainment',
			date: '2024-07-13T09:15:32Z',
			amount: -10.0,
			recurring: false,
		},
		{
			name: 'James Thompson',
			category: 'Bills',
			date: '2024-07-12T13:40:46Z',
			amount: -95.5,
			recurring: false,
		},
		{
			name: 'Ella Phillips',
			category: 'Food & Dining',
			date: '2024-07-11T18:05:59Z',
			amount: -33.75,
			recurring: false,
		},
		{
			name: 'Yuna Kim',
			category: 'Food & Dining',
			date: '2024-07-10T12:30:13Z',
			amount: -27.5,
			recurring: false,
		},
		{
			name: 'Sofia Peterson',
			category: 'Transportation',
			date: '2024-07-09T08:55:27Z',
			amount: -12.5,
			recurring: false,
		},
		{
			name: 'Mason Martinez',
			category: 'Lifestyle',
			date: '2024-07-08T15:20:41Z',
			amount: -65.0,
			recurring: false,
		},
		{
			name: 'Sebastian Cook',
			category: 'Transportation',
			date: '2024-07-07T11:45:55Z',
			amount: -20.0,
			recurring: false,
		},
		{
			name: 'William Harris',
			category: 'General',
			date: '2024-07-06T17:10:09Z',
			amount: 20.0,
			recurring: false,
		},
		{
			name: 'Elevate Education',
			category: 'Education',
			date: '2024-07-05T11:15:22Z',
			amount: -50.0,
			recurring: true,
			frequency: 30,
		},
		{
			name: 'Serenity Spa & Wellness',
			category: 'Personal Care',
			date: '2024-07-03T14:00:37Z',
			amount: -30.0,
			recurring: true,
			frequency: 30,
		},
		{
			name: 'Spark Electric Solutions',
			category: 'Bills',
			date: '2024-07-02T09:25:51Z',
			amount: -100.0,
			recurring: true,
			frequency: 30,
		},
		{
			name: 'Swift Ride Share',
			category: 'Transportation',
			date: '2024-07-02T19:50:05Z',
			amount: -16.5,
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
			frequency: t.recurring ? (t.frequency ?? null) : null,
		})),
	});

	// 7. Budgets
	const budgets = [
		{
			category: 'Entertainment',
			maximum: 50,
			theme: '#277C78',
			type: BudgetType.MONTHLY,
		},
		{
			category: 'Bills',
			maximum: 750,
			theme: '#82C9D7',
			type: BudgetType.MONTHLY,
		},
		{
			category: 'Food & Dining',
			maximum: 75,
			theme: '#F2CDAC',
			type: BudgetType.MONTHLY,
		},
		{
			category: 'Personal Care',
			maximum: 100,
			theme: '#626070',
			type: BudgetType.MONTHLY,
		},
	];

	for (const b of budgets) {
		await prisma.budget.upsert({
			where: {
				userId_categoryId: {
					userId: user.id,
					categoryId: categories[b.category],
				},
			},
			update: {
				maximum: b.maximum,
				themeId: themes[b.theme],
				type: b.type,
			},
			create: {
				userId: user.id,
				categoryId: categories[b.category],
				maximum: b.maximum,
				themeId: themes[b.theme],
				type: b.type,
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
