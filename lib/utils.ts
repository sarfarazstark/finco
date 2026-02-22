import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodType } from 'zod';

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export function validate<T>(schema: ZodType<T>, form: FormData) {
	const raw = Object.fromEntries(form.entries());
	const result = schema.safeParse(raw);

	if (!result.success) {
		return {
			data: null as T | null,
			errors: result.error.flatten().fieldErrors,
		};
	}

	return { data: result.data as T, errors: null };
}

export function getCurrencySymbol(currencyCode: string = 'USD') {
	return (
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currencyCode,
		})
			.formatToParts(0)
			.find(p => p.type === 'currency')?.value || '$'
	);
}

export function formatBalance(amount: number, currencyCode: string = 'USD') {
	const isNegative = amount < 0;
	const colorClass = isNegative
		? 'text-red-500'
		: amount > 0
			? 'text-green-600'
			: 'text-grey-500';
	const formattedAmount = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currencyCode,
	}).format(Math.abs(amount));

	return {
		text: isNegative ? `-${formattedAmount}` : formattedAmount,
		colorClass,
	};
}

export function formatTransactionDate(dateInput: Date | string | number) {
	const date = new Date(dateInput);
	const now = new Date();

	const isToday =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();

	const isThisYear = date.getFullYear() === now.getFullYear();

	const timePart = date.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});

	if (isToday) {
		return timePart;
	}

	const datePart = date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
	});

	if (isThisYear) {
		return `${datePart}, ${timePart}`;
	}

	return date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}
