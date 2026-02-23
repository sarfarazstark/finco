// prisma/seed.ts
import { auth } from '@/lib/auth';
import { PrismaPg } from '@prisma/adapter-pg';
import { BudgetType, PrismaClient, TransactionType } from '@prisma/client';

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
	{ name: 'home', color: 'text-teal-600', bg: 'bg-teal-50' },
	{ name: 'car', color: 'text-cyan-600', bg: 'bg-cyan-50' },
	{ name: 'briefcase', color: 'text-blue-700', bg: 'bg-blue-50' },
	{ name: 'chart-bar', color: 'text-green-600', bg: 'bg-green-50' },
	{ name: 'coin', color: 'text-amber-600', bg: 'bg-amber-50' },
	{ name: 'wallet', color: 'text-emerald-600', bg: 'bg-emerald-50' },
	{ name: 'pig-money', color: 'text-pink-500', bg: 'bg-pink-50' },
	{ name: 'stethoscope', color: 'text-red-600', bg: 'bg-red-50' },
	{ name: 'barbell', color: 'text-lime-600', bg: 'bg-lime-50' },
	{ name: 'shirt', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
	{ name: 'device-mobile', color: 'text-slate-700', bg: 'bg-slate-50' },
	{ name: 'wifi', color: 'text-blue-500', bg: 'bg-blue-50' },
	{ name: 'droplet', color: 'text-cyan-500', bg: 'bg-cyan-50' },
	{ name: 'tree', color: 'text-green-700', bg: 'bg-green-50' },
	{ name: 'paw', color: 'text-orange-400', bg: 'bg-orange-50' },
	{ name: 'tool', color: 'text-gray-700', bg: 'bg-gray-50' },
	{ name: 'music', color: 'text-violet-500', bg: 'bg-violet-50' },
	{ name: 'book', color: 'text-indigo-500', bg: 'bg-indigo-50' },
	{ name: 'camera', color: 'text-rose-500', bg: 'bg-rose-50' },
	{ name: 'baby-carriage', color: 'text-pink-400', bg: 'bg-pink-50' },
	{ name: 'beach', color: 'text-yellow-500', bg: 'bg-yellow-50' },
	{ name: 'building', color: 'text-zinc-600', bg: 'bg-zinc-50' },
	{ name: 'vaccine', color: 'text-red-400', bg: 'bg-red-50' },
	{ name: 'antenna', color: 'text-sky-500', bg: 'bg-sky-50' },
	{ name: 'gas-station', color: 'text-stone-600', bg: 'bg-stone-50' },
	{ name: 'smoking', color: 'text-neutral-500', bg: 'bg-neutral-50' },
	{ name: 'glass-full', color: 'text-teal-500', bg: 'bg-teal-50' },
	{ name: 'printer', color: 'text-gray-500', bg: 'bg-gray-50' },
	{ name: 'calendar-repeat', color: 'text-purple-700', bg: 'bg-purple-50' },
	{ name: 'category', color: 'text-indigo-400', bg: 'bg-indigo-50' },
	{ name: 'salad', color: 'text-green-500', bg: 'bg-green-50' },
	{ name: 'coffee', color: 'text-amber-700', bg: 'bg-amber-50' },
	{ name: 'cake', color: 'text-pink-400', bg: 'bg-pink-50' },
	{ name: 'meat', color: 'text-red-400', bg: 'bg-red-50' },
	{ name: 'bottle', color: 'text-lime-500', bg: 'bg-lime-50' },
	{ name: 'bike', color: 'text-cyan-700', bg: 'bg-cyan-50' },
	{ name: 'train', color: 'text-blue-800', bg: 'bg-blue-50' },
	{ name: 'ship', color: 'text-sky-700', bg: 'bg-sky-50' },
	{ name: 'motorbike', color: 'text-orange-700', bg: 'bg-orange-50' },
	{ name: 'road', color: 'text-stone-500', bg: 'bg-stone-50' },
	{ name: 'helicopter', color: 'text-slate-600', bg: 'bg-slate-50' },
	{ name: 'ball-tennis', color: 'text-yellow-600', bg: 'bg-yellow-50' },
	{ name: 'swimming', color: 'text-blue-400', bg: 'bg-blue-50' },
	{ name: 'run', color: 'text-green-600', bg: 'bg-green-50' },
	{ name: 'ball-football', color: 'text-emerald-500', bg: 'bg-emerald-50' },
	{ name: 'ball-basketball', color: 'text-orange-500', bg: 'bg-orange-50' },
	{ name: 'yoga', color: 'text-violet-400', bg: 'bg-violet-50' },
	{ name: 'microscope', color: 'text-teal-700', bg: 'bg-teal-50' },
	{ name: 'flask', color: 'text-purple-400', bg: 'bg-purple-50' },
	{ name: 'certificate', color: 'text-amber-500', bg: 'bg-amber-50' },
	{ name: 'pencil', color: 'text-yellow-700', bg: 'bg-yellow-50' },
	{ name: 'clipboard', color: 'text-indigo-400', bg: 'bg-indigo-50' },
	{ name: 'device-tv', color: 'text-slate-500', bg: 'bg-slate-50' },
	{ name: 'headphones', color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
	{ name: 'dice', color: 'text-rose-400', bg: 'bg-rose-50' },
	{ name: 'puzzle', color: 'text-indigo-500', bg: 'bg-indigo-50' },
	{ name: 'brush', color: 'text-pink-600', bg: 'bg-pink-50' },
	{ name: 'needle-thread', color: 'text-violet-600', bg: 'bg-violet-50' },
	{ name: 'garden-cart', color: 'text-green-700', bg: 'bg-green-50' },
	{ name: 'hammer', color: 'text-stone-600', bg: 'bg-stone-50' },
	{ name: 'axe', color: 'text-red-700', bg: 'bg-red-50' },
	{ name: 'bulb', color: 'text-yellow-400', bg: 'bg-yellow-50' },
	{ name: 'solar-panel', color: 'text-amber-400', bg: 'bg-amber-50' },
	{ name: 'recycle', color: 'text-green-500', bg: 'bg-green-50' },
	{ name: 'snowflake', color: 'text-sky-400', bg: 'bg-sky-50' },
	{ name: 'sun', color: 'text-orange-400', bg: 'bg-orange-50' },
	{ name: 'moon', color: 'text-indigo-300', bg: 'bg-indigo-50' },
	{ name: 'umbrella', color: 'text-blue-500', bg: 'bg-blue-50' },
	{ name: 'first-aid-kit', color: 'text-red-500', bg: 'bg-red-50' },
	{ name: 'pill', color: 'text-rose-500', bg: 'bg-rose-50' },
	{ name: 'dental', color: 'text-cyan-500', bg: 'bg-cyan-50' },
	{ name: 'eye', color: 'text-teal-500', bg: 'bg-teal-50' },
	{ name: 'building-hospital', color: 'text-red-600', bg: 'bg-red-50' },
	{ name: 'currency-dollar', color: 'text-green-600', bg: 'bg-green-50' },
	{ name: 'currency-euro', color: 'text-blue-600', bg: 'bg-blue-50' },
	{ name: 'currency-bitcoin', color: 'text-orange-500', bg: 'bg-orange-50' },
	{ name: 'chart-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
	{ name: 'chart-pie', color: 'text-violet-500', bg: 'bg-violet-50' },
	{ name: 'building-store', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
	{ name: 'hanger', color: 'text-pink-500', bg: 'bg-pink-50' },
	{ name: 'shoe', color: 'text-amber-600', bg: 'bg-amber-50' },
	{ name: 'diamond', color: 'text-cyan-600', bg: 'bg-cyan-50' },
	{ name: 'device-watch', color: 'text-slate-700', bg: 'bg-slate-50' },
	{ name: 'backpack', color: 'text-orange-600', bg: 'bg-orange-50' },
	{ name: 'map-pin', color: 'text-rose-600', bg: 'bg-rose-50' },
	{ name: 'world', color: 'text-sky-500', bg: 'bg-sky-50' },
	{ name: 'hotel-service', color: 'text-indigo-600', bg: 'bg-indigo-50' },
	{ name: 'tent', color: 'text-lime-600', bg: 'bg-lime-50' },
	{ name: 'rollercoaster', color: 'text-purple-600', bg: 'bg-purple-50' },
	{ name: 'artboard', color: 'text-fuchsia-700', bg: 'bg-fuchsia-50' },
	{ name: 'augmented-reality', color: 'text-cyan-700', bg: 'bg-cyan-50' },
	{ name: 'badge', color: 'text-amber-500', bg: 'bg-amber-50' },
	{ name: 'balloon', color: 'text-pink-500', bg: 'bg-pink-50' },
	{ name: 'bath', color: 'text-sky-500', bg: 'bg-sky-50' },
	{ name: 'bed', color: 'text-indigo-400', bg: 'bg-indigo-50' },
	{ name: 'beer', color: 'text-yellow-600', bg: 'bg-yellow-50' },
	{ name: 'bell', color: 'text-orange-400', bg: 'bg-orange-50' },
	{ name: 'bible', color: 'text-stone-500', bg: 'bg-stone-50' },
	{ name: 'bike-off', color: 'text-red-400', bg: 'bg-red-50' },
	{ name: 'pool', color: 'text-green-700', bg: 'bg-green-50' },
	{ name: 'brand-netflix', color: 'text-red-600', bg: 'bg-red-50' },
	{ name: 'brand-spotify', color: 'text-green-500', bg: 'bg-green-50' },
	{ name: 'brand-youtube', color: 'text-red-500', bg: 'bg-red-50' },
	{ name: 'brand-twitch', color: 'text-purple-600', bg: 'bg-purple-50' },
	{ name: 'brand-apple', color: 'text-gray-700', bg: 'bg-gray-50' },
	{ name: 'brand-google-play', color: 'text-green-600', bg: 'bg-green-50' },
	{ name: 'brand-amazon', color: 'text-amber-600', bg: 'bg-amber-50' },
	{ name: 'brand-paypal', color: 'text-blue-700', bg: 'bg-blue-50' },
	{ name: 'building-church', color: 'text-stone-600', bg: 'bg-stone-50' },
	{ name: 'building-cottage', color: 'text-lime-700', bg: 'bg-lime-50' },
	{ name: 'building-factory', color: 'text-zinc-600', bg: 'bg-zinc-50' },
	{ name: 'building-skyscraper', color: 'text-slate-600', bg: 'bg-slate-50' },
	{ name: 'calendar-event', color: 'text-rose-500', bg: 'bg-rose-50' },
	{ name: 'candle', color: 'text-amber-400', bg: 'bg-amber-50' },
	{ name: 'candy', color: 'text-pink-400', bg: 'bg-pink-50' },
	{ name: 'chess', color: 'text-neutral-600', bg: 'bg-neutral-50' },
	{ name: 'christmas-tree', color: 'text-green-700', bg: 'bg-green-50' },
	{ name: 'cpu', color: 'text-teal-600', bg: 'bg-teal-50' },
	{ name: 'clock', color: 'text-blue-500', bg: 'bg-blue-50' },
	{ name: 'cloud', color: 'text-sky-400', bg: 'bg-sky-50' },
	{ name: 'confetti', color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
	{ name: 'contrast', color: 'text-gray-600', bg: 'bg-gray-50' },
	{ name: 'cookie', color: 'text-amber-700', bg: 'bg-amber-50' },
	{ name: 'crown', color: 'text-yellow-500', bg: 'bg-yellow-50' },
	{ name: 'cup', color: 'text-orange-500', bg: 'bg-orange-50' },
	{ name: 'desk', color: 'text-slate-500', bg: 'bg-slate-50' },
	{ name: 'dog', color: 'text-orange-400', bg: 'bg-orange-50' },
	{ name: 'drone', color: 'text-cyan-600', bg: 'bg-cyan-50' },
	{ name: 'egg', color: 'text-yellow-400', bg: 'bg-yellow-50' },
	{ name: 'escalator-up', color: 'text-blue-400', bg: 'bg-blue-50' },
	{ name: 'feather', color: 'text-lime-500', bg: 'bg-lime-50' },
	{ name: 'file-invoice', color: 'text-indigo-500', bg: 'bg-indigo-50' },
	{ name: 'fish', color: 'text-teal-400', bg: 'bg-teal-50' },
	{ name: 'flame', color: 'text-red-500', bg: 'bg-red-50' },
	{ name: 'flower', color: 'text-rose-400', bg: 'bg-rose-50' },
	{ name: 'focus', color: 'text-violet-400', bg: 'bg-violet-50' },
	{ name: 'forklift', color: 'text-stone-600', bg: 'bg-stone-50' },
	{ name: 'friends', color: 'text-emerald-500', bg: 'bg-emerald-50' },
	{ name: 'ghost', color: 'text-purple-400', bg: 'bg-purple-50' },
	{ name: 'grill', color: 'text-orange-600', bg: 'bg-orange-50' },
	{ name: 'horse-toy', color: 'text-amber-500', bg: 'bg-amber-50' },
	{ name: 'ice-cream', color: 'text-pink-300', bg: 'bg-pink-50' },
	{ name: 'ironing', color: 'text-blue-300', bg: 'bg-blue-50' },
	{ name: 'jetpack', color: 'text-cyan-500', bg: 'bg-cyan-50' },
	{ name: 'kayak', color: 'text-sky-600', bg: 'bg-sky-50' },
	{ name: 'wind', color: 'text-fuchsia-400', bg: 'bg-fuchsia-50' },
	{ name: 'ladder', color: 'text-zinc-500', bg: 'bg-zinc-50' },
	{ name: 'lamp', color: 'text-yellow-500', bg: 'bg-yellow-50' },
	{ name: 'leaf', color: 'text-green-500', bg: 'bg-green-50' },
	{ name: 'lego', color: 'text-red-400', bg: 'bg-red-50' },
	{ name: 'lifebuoy', color: 'text-orange-500', bg: 'bg-orange-50' },
	{ name: 'luggage', color: 'text-indigo-500', bg: 'bg-indigo-50' },
	{ name: 'macro', color: 'text-emerald-400', bg: 'bg-emerald-50' },
	{ name: 'massage', color: 'text-rose-500', bg: 'bg-rose-50' },
	{ name: 'milk', color: 'text-blue-200', bg: 'bg-blue-50' },
	{ name: 'moped', color: 'text-teal-500', bg: 'bg-teal-50' },
	{ name: 'mountain', color: 'text-stone-500', bg: 'bg-stone-50' },
	{ name: 'mushroom', color: 'text-amber-600', bg: 'bg-amber-50' },
	{ name: 'diamond', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
	{ name: 'notebook', color: 'text-violet-500', bg: 'bg-violet-50' },
	{ name: 'pacman', color: 'text-yellow-400', bg: 'bg-yellow-50' },
	{ name: 'parachute', color: 'text-sky-500', bg: 'bg-sky-50' },
	{ name: 'parking', color: 'text-blue-600', bg: 'bg-blue-50' },
	{ name: 'pennant', color: 'text-red-500', bg: 'bg-red-50' },
	{ name: 'phone-call', color: 'text-green-600', bg: 'bg-green-50' },
	{ name: 'photo', color: 'text-rose-400', bg: 'bg-rose-50' },
	{ name: 'plant', color: 'text-lime-600', bg: 'bg-lime-50' },
	{ name: 'pool', color: 'text-cyan-400', bg: 'bg-cyan-50' },
	{ name: 'bucket', color: 'text-yellow-500', bg: 'bg-yellow-50' },
	{ name: 'tools-kitchen-2', color: 'text-orange-700', bg: 'bg-orange-50' },
	{ name: 'robot', color: 'text-slate-600', bg: 'bg-slate-50' },
	{ name: 'rocket', color: 'text-indigo-600', bg: 'bg-indigo-50' },
	{ name: 'christmas-tree', color: 'text-red-600', bg: 'bg-red-50' },
	{ name: 'scooter', color: 'text-teal-600', bg: 'bg-teal-50' },
	{ name: 'seeding', color: 'text-green-400', bg: 'bg-green-50' },
	{ name: 'shield', color: 'text-blue-700', bg: 'bg-blue-50' },
	{ name: 'skateboard', color: 'text-orange-500', bg: 'bg-orange-50' },
	{ name: 'slice', color: 'text-amber-500', bg: 'bg-amber-50' },
	{ name: 'sofa', color: 'text-violet-600', bg: 'bg-violet-50' },
	{ name: 'soup', color: 'text-orange-400', bg: 'bg-orange-50' },
	{ name: 'sparkles', color: 'text-yellow-400', bg: 'bg-yellow-50' },
	{ name: 'speakerphone', color: 'text-purple-500', bg: 'bg-purple-50' },
	{ name: 'spray', color: 'text-cyan-500', bg: 'bg-cyan-50' },
	{ name: 'swords', color: 'text-red-700', bg: 'bg-red-50' },
	{ name: 'tir', color: 'text-zinc-600', bg: 'bg-zinc-50' },
	{ name: 'trophy', color: 'text-amber-500', bg: 'bg-amber-50' },
	{ name: 'trowel', color: 'text-stone-500', bg: 'bg-stone-50' },
	{ name: 'ufo', color: 'text-green-400', bg: 'bg-green-50' },
	{ name: 'universe', color: 'text-indigo-400', bg: 'bg-indigo-50' },
	{ name: 'urgent', color: 'text-red-600', bg: 'bg-red-50' },
	{ name: 'usb', color: 'text-slate-500', bg: 'bg-slate-50' },
	{ name: 'amphora', color: 'text-rose-400', bg: 'bg-rose-50' },
	{ name: 'venus', color: 'text-pink-500', bg: 'bg-pink-50' },
	{ name: 'video', color: 'text-violet-500', bg: 'bg-violet-50' },
	{ name: 'virus', color: 'text-red-400', bg: 'bg-red-50' },
	{ name: 'volcano', color: 'text-orange-700', bg: 'bg-orange-50' },
	{ name: 'wash-machine', color: 'text-blue-400', bg: 'bg-blue-50' },
	{ name: 'wave-saw-tool', color: 'text-teal-500', bg: 'bg-teal-50' },
	{ name: 'windmill', color: 'text-lime-500', bg: 'bg-lime-50' },
	{ name: 'wood', color: 'text-amber-800', bg: 'bg-amber-50' },
	{ name: 'world-dollar', color: 'text-emerald-600', bg: 'bg-emerald-50' },
	{ name: 'writing', color: 'text-indigo-500', bg: 'bg-indigo-50' },
	{ name: 'xbox-a', color: 'text-green-600', bg: 'bg-green-50' },
	{ name: 'yin-yang', color: 'text-neutral-700', bg: 'bg-neutral-50' },
	{ name: 'zodiac-aquarius', color: 'text-sky-500', bg: 'bg-sky-50' },
	{ name: 'zoom-money', color: 'text-emerald-500', bg: 'bg-emerald-50' },
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
			date: '2026-01-19T14:23:11Z',
			amount: 75.5,
			recurring: false,
		},
		{
			name: 'Savory Bites Bistro',
			category: 'Food & Dining',
			date: '2026-01-19T20:23:11Z',
			amount: -55.5,
			recurring: false,
		},
		{
			name: 'Daniel Carter',
			category: 'General',
			date: '2026-01-18T09:45:32Z',
			amount: -42.3,
			recurring: false,
		},
		{
			name: 'Sun Park',
			category: 'General',
			date: '2026-01-17T16:12:05Z',
			amount: 120.0,
			recurring: false,
		},
		{
			name: 'Urban Services Hub',
			category: 'General',
			date: '2026-01-17T21:08:09Z',
			amount: -65.0,
			recurring: false,
		},
		{
			name: 'Liam Hughes',
			category: 'Groceries',
			date: '2026-01-15T18:20:33Z',
			amount: 65.75,
			recurring: false,
		},
		{
			name: 'Lily Ramirez',
			category: 'General',
			date: '2026-01-14T13:05:27Z',
			amount: 50.0,
			recurring: false,
		},
		{
			name: 'Ethan Clark',
			category: 'Food & Dining',
			date: '2026-01-13T20:15:59Z',
			amount: -32.5,
			recurring: false,
		},
		{
			name: 'James Thompson',
			category: 'Entertainment',
			date: '2026-01-11T15:45:38Z',
			amount: -5.0,
			recurring: false,
		},
		{
			name: 'Pixel Playground',
			category: 'Entertainment',
			date: '2026-01-11T18:45:38Z',
			amount: -10.0,
			recurring: true,
		},
		{
			name: 'Ella Phillips',
			category: 'Food & Dining',
			date: '2026-01-10T19:22:51Z',
			amount: -45.0,
			recurring: false,
		},
		{
			name: 'Sofia Peterson',
			category: 'Transportation',
			date: '2026-01-08T08:55:17Z',
			amount: -15.0,
			recurring: false,
		},
		{
			name: 'Mason Martinez',
			category: 'Lifestyle',
			date: '2026-01-07T17:40:29Z',
			amount: -35.25,
			recurring: false,
		},
		{
			name: 'Green Plate Eatery',
			category: 'Groceries',
			date: '2026-01-06T08:25:44Z',
			amount: -78.5,
			recurring: false,
		},
		{
			name: 'Sebastian Cook',
			category: 'Transportation',
			date: '2026-01-06T10:05:44Z',
			amount: -22.5,
			recurring: false,
		},
		{
			name: 'William Harris',
			category: 'Personal Care',
			date: '2026-01-05T14:30:56Z',
			amount: -10.0,
			recurring: false,
		},
		{
			name: 'Elevate Education',
			category: 'Education',
			date: '2026-01-04T11:15:22Z',
			amount: -50.0,
			recurring: true,
		},
		{
			name: 'Serenity Spa & Wellness',
			category: 'Personal Care',
			date: '2026-01-03T14:00:37Z',
			amount: -30.0,
			recurring: true,
		},
		{
			name: 'Spark Electric Solutions',
			category: 'Bills',
			date: '2026-01-02T09:25:11Z',
			amount: -100.0,
			recurring: true,
		},
		{
			name: 'Rina Sato',
			category: 'Bills',
			date: '2026-01-02T13:31:11Z',
			amount: -50.0,
			recurring: false,
		},
		{
			name: 'Swift Ride Share',
			category: 'Transportation',
			date: '2026-01-01T18:40:33Z',
			amount: -18.75,
			recurring: false,
		},
		{
			name: 'Aqua Flow Utilities',
			category: 'Bills',
			date: '2026-01-30T13:20:14Z',
			amount: -100.0,
			recurring: true,
		},
		{
			name: 'EcoFuel Energy',
			category: 'Bills',
			date: '2026-01-29T11:55:29Z',
			amount: -35.0,
			recurring: true,
		},
		{
			name: 'Yuna Kim',
			category: 'Food & Dining',
			date: '2026-01-29T13:51:29Z',
			amount: -28.5,
			recurring: false,
		},
		{
			name: 'Flavor Fiesta',
			category: 'Food & Dining',
			date: '2026-01-27T20:15:06Z',
			amount: -42.75,
			recurring: false,
		},
		{
			name: 'Harper Edwards',
			category: 'Shopping',
			date: '2026-01-26T09:43:23Z',
			amount: -89.99,
			recurring: false,
		},
		{
			name: 'Buzz Marketing Group',
			category: 'General',
			date: '2026-01-26T14:40:23Z',
			amount: 3358.0,
			recurring: false,
		},
		{
			name: 'TechNova Innovations',
			category: 'Shopping',
			date: '2026-01-25T16:25:37Z',
			amount: -29.99,
			recurring: false,
		},
		{
			name: 'ByteWise',
			category: 'Lifestyle',
			date: '2026-01-23T09:35:14Z',
			amount: -49.99,
			recurring: true,
		},
		{
			name: 'Nimbus Data Storage',
			category: 'Bills',
			date: '2026-01-21T10:05:42Z',
			amount: -9.99,
			recurring: true,
		},
		{
			name: 'Emma Richardson',
			category: 'General',
			date: '2026-01-20T17:30:55Z',
			amount: -25.0,
			recurring: false,
		},
		{
			name: 'Daniel Carter',
			category: 'General',
			date: '2026-01-19T12:45:09Z',
			amount: 50.0,
			recurring: false,
		},
		{
			name: 'Sun Park',
			category: 'General',
			date: '2026-01-18T19:20:23Z',
			amount: -38.5,
			recurring: false,
		},
		{
			name: 'Harper Edwards',
			category: 'Shopping',
			date: '2026-01-17T14:55:37Z',
			amount: -29.99,
			recurring: false,
		},
		{
			name: 'Liam Hughes',
			category: 'Groceries',
			date: '2026-01-16T10:10:51Z',
			amount: -52.75,
			recurring: false,
		},
		{
			name: 'Lily Ramirez',
			category: 'General',
			date: '2026-01-15T16:35:04Z',
			amount: 75.0,
			recurring: false,
		},
		{
			name: 'Ethan Clark',
			category: 'Food & Dining',
			date: '2026-01-14T20:50:18Z',
			amount: -41.25,
			recurring: false,
		},
		{
			name: 'Rina Sato',
			category: 'Entertainment',
			date: '2026-01-13T09:15:32Z',
			amount: -10.0,
			recurring: false,
		},
		{
			name: 'James Thompson',
			category: 'Bills',
			date: '2026-01-12T13:40:46Z',
			amount: -95.5,
			recurring: false,
		},
		{
			name: 'Ella Phillips',
			category: 'Food & Dining',
			date: '2026-01-11T18:05:59Z',
			amount: -33.75,
			recurring: false,
		},
		{
			name: 'Yuna Kim',
			category: 'Food & Dining',
			date: '2026-01-10T12:30:13Z',
			amount: -27.5,
			recurring: false,
		},
		{
			name: 'Sofia Peterson',
			category: 'Transportation',
			date: '2026-01-09T08:55:27Z',
			amount: -12.5,
			recurring: false,
		},
		{
			name: 'Mason Martinez',
			category: 'Lifestyle',
			date: '2026-01-08T15:20:41Z',
			amount: -65.0,
			recurring: false,
		},
		{
			name: 'Sebastian Cook',
			category: 'Transportation',
			date: '2026-01-07T11:45:55Z',
			amount: -20.0,
			recurring: false,
		},
		{
			name: 'William Harris',
			category: 'General',
			date: '2026-01-06T17:10:09Z',
			amount: 20.0,
			recurring: false,
		},
		{
			name: 'Elevate Education',
			category: 'Education',
			date: '2026-01-05T11:15:22Z',
			amount: -50.0,
			recurring: true,
		},
		{
			name: 'Serenity Spa & Wellness',
			category: 'Personal Care',
			date: '2026-01-03T14:00:37Z',
			amount: -30.0,
			recurring: true,
		},
		{
			name: 'Spark Electric Solutions',
			category: 'Bills',
			date: '2026-01-02T09:25:51Z',
			amount: -100.0,
			recurring: true,
		},
		{
			name: 'Swift Ride Share',
			category: 'Transportation',
			date: '2026-01-02T19:50:05Z',
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
