'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import {
	Dropdown,
	DropdownTrigger,
	DropdownValue,
	DropdownContent,
	DropdownItem,
} from '@/components/ui/dropdown';

export function TransactionFilters({ categories }: { categories: string[] }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [, startTransition] = useTransition();

	const defaultSearch = searchParams.get('search') || '';
	const defaultSort = searchParams.get('sort') || 'latest';
	const defaultCategory = searchParams.get('category') || 'All';

	const [search, setSearch] = useState(defaultSearch);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (search !== defaultSearch) {
				const params = new URLSearchParams(searchParams.toString());
				if (search) {
					params.set('search', search);
				} else {
					params.delete('search');
				}
				params.delete('page');
				startTransition(() => {
					router.push(`${pathname}?${params.toString()}`, {
						scroll: false,
					});
					window.scrollTo({ top: 0, behavior: 'smooth' });
				});
			}
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [search, defaultSearch, pathname, router, searchParams]);

	const updateFilter = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value === 'All' || !value) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
		params.delete('page');
		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	};

	return (
		<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
			<span className="flex items-center gap-2 border border-grey-200 rounded-lg px-4 py-1.5 w-full md:w-80 h-10">
				<input
					type="text"
					placeholder="Search transaction"
					className="border-none p-0 text-sm rounded-none w-full outline-none focus:ring-0"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<IconSearch
					className="text-grey-900 w-4 h-4 shrink-0"
					stroke={1.5}
				/>
			</span>

			<div className="flex items-center gap-6">
				<div className="flex items-center gap-2 text-sm">
					<p className="text-grey-500 whitespace-nowrap">Sort by</p>
					<Dropdown
						defaultValue={defaultSort}
						onValueChange={val => updateFilter('sort', val)}
					>
						<DropdownTrigger className="w-32 border border-grey-200 rounded-lg px-4 py-2 h-10 bg-white">
							<DropdownValue placeholder="Sort" />
						</DropdownTrigger>
						<DropdownContent>
							<DropdownItem value="latest">Latest</DropdownItem>
							<DropdownItem value="oldest">Oldest</DropdownItem>
							<DropdownItem value="atoz">A to Z</DropdownItem>
							<DropdownItem value="ztoa">Z to A</DropdownItem>
							<DropdownItem value="highest">Highest</DropdownItem>
							<DropdownItem value="lowest">Lowest</DropdownItem>
						</DropdownContent>
					</Dropdown>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<p className="text-grey-500 whitespace-nowrap">Category</p>
					<Dropdown
						defaultValue={defaultCategory}
						onValueChange={val => updateFilter('category', val)}
					>
						<DropdownTrigger className="w-32 border border-grey-200 rounded-lg px-4 py-2 h-10 bg-white">
							<DropdownValue placeholder="Category" />
						</DropdownTrigger>
						<DropdownContent>
							<DropdownItem value="All">
								All
							</DropdownItem>
							{categories.map(cat => (
								<DropdownItem key={cat} value={cat}>
									{cat}
								</DropdownItem>
							))}
						</DropdownContent>
					</Dropdown>
				</div>
			</div>
		</div>
	);
}
