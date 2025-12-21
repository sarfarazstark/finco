import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodType } from 'zod';
import { usePathname } from 'next/navigation';

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

export function useIsRoute(route: string): boolean {
	const pathname = usePathname();
	return pathname === route;
}
