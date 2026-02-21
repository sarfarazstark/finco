'use client';

import { usePathname } from 'next/navigation';

export function useIsRoute(route: string): boolean {
	const pathname = usePathname();
	return pathname === route;
}
