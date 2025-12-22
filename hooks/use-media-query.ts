'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(px: number): boolean {
	const query = `(max-width: ${px}px)`;

	const [matches, setMatches] = useState(() => {
		if (typeof window === 'undefined') return false;
		return window.matchMedia(query).matches;
	});

	useEffect(() => {
		const media = window.matchMedia(query);

		const onChange = (e: MediaQueryListEvent) => {
			setMatches(e.matches);
		};

		media.addEventListener('change', onChange);

		return () => {
			media.removeEventListener('change', onChange);
		};
	}, [query]);

	return matches;
}
