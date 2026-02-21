'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export function Pagination({
	totalPages,
	currentPage,
}: {
	totalPages: number;
	currentPage: number;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [, startTransition] = useTransition();

	const createPageUrl = (pageNumber: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', pageNumber.toString());
		return `${pathname}?${params.toString()}`;
	};

	const handleNavigation = (url: string) => {
		startTransition(() => {
			router.push(url, { scroll: false });
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	};

	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-between pt-6 border-t border-grey-100">
			<Button
				variant="secondary"
				onClick={() => handleNavigation(createPageUrl(currentPage - 1))}
				disabled={currentPage <= 1}
				className="w-24 border border-grey-200"
			>
				<IconChevronLeft className="w-4 h-4 mr-2" /> Prev
			</Button>

			<div className="flex items-center gap-2">
				{Array.from({ length: totalPages }).map((_, i) => {
					const pageNum = i + 1;
					const isActive = pageNum === currentPage;

					return (
						<button
							key={pageNum}
							onClick={() =>
								handleNavigation(createPageUrl(pageNum))
							}
							className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-preset-4-bold transition-colors ${
								isActive
									? 'bg-grey-900 text-white'
									: 'text-grey-500 hover:bg-grey-100'
							}`}
						>
							{pageNum}
						</button>
					);
				})}
			</div>

			<Button
				variant="secondary"
				onClick={() => handleNavigation(createPageUrl(currentPage + 1))}
				disabled={currentPage >= totalPages}
				className="w-24 border border-grey-200"
			>
				Next <IconChevronRight className="w-4 h-4 ml-2" />
			</Button>
		</div>
	);
}
