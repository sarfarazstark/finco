'use client';

import { useState } from 'react';
import {
	BillRow,
	type RecurringTransactionWithRelations,
	type BillStatus,
} from './bill-row';
import {
	Dropdown,
	DropdownTrigger,
	DropdownValue,
	DropdownContent,
	DropdownItem,
} from '@/components/ui/dropdown';

type SortKey = 'latest' | 'oldest' | 'a-z' | 'z-a' | 'highest' | 'lowest';

interface BillsTableProps {
	bills: RecurringTransactionWithRelations[];
	currency: string;
	statusMap: Record<string, BillStatus>;
}

export function BillsTable({ bills, currency, statusMap }: BillsTableProps) {
	const [search, setSearch] = useState('');
	const [sortBy, setSortBy] = useState<SortKey>('latest');

	const filtered = bills.filter(b =>
		b.name.toLowerCase().includes(search.toLowerCase())
	);

	const sorted = [...filtered].sort((a, b) => {
		switch (sortBy) {
			case 'latest':
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			case 'oldest':
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			case 'a-z':
				return a.name.localeCompare(b.name);
			case 'z-a':
				return b.name.localeCompare(a.name);
			case 'highest':
				return Math.abs(b.amount) - Math.abs(a.amount);
			case 'lowest':
				return Math.abs(a.amount) - Math.abs(b.amount);
			default:
				return 0;
		}
	});

	return (
		<div className="bg-white rounded-xl p-6 flex-1">
			<div className="flex items-center justify-between gap-4 mb-6">
				<div className="relative flex-1 max-w-sm">
					<i className="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-grey-400" />
					<input
						type="text"
						placeholder="Search bills"
						value={search}
						onChange={e => setSearch(e.target.value)}
						className="w-full h-10 pl-4 pr-10 border border-grey-200 rounded-lg text-sm font-preset-4 text-grey-900 placeholder:text-grey-400 focus:outline-none focus:border-grey-400 transition-colors"
					/>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-sm text-grey-500 whitespace-nowrap">
						Sort by
					</span>
					<Dropdown
						value={sortBy}
						onValueChange={v => setSortBy(v as SortKey)}
					>
						<DropdownTrigger className="w-28">
							<DropdownValue placeholder="Sort" />
						</DropdownTrigger>
						<DropdownContent>
							<DropdownItem value="latest">Latest</DropdownItem>
							<DropdownItem value="oldest">Oldest</DropdownItem>
							<DropdownItem value="a-z">A to Z</DropdownItem>
							<DropdownItem value="z-a">Z to A</DropdownItem>
							<DropdownItem value="highest">Highest</DropdownItem>
							<DropdownItem value="lowest">Lowest</DropdownItem>
						</DropdownContent>
					</Dropdown>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="text-left font-preset-5 text-grey-500 border-b border-grey-100">
							<th className="pb-3 font-normal">Bill Title</th>
							<th className="pb-3 font-normal">Due Date</th>
							<th className="pb-3 font-normal text-right">
								Amount
							</th>
						</tr>
					</thead>
					<tbody>
						{sorted.length > 0 ? (
							sorted.map(bill => (
								<BillRow
									key={bill.id}
									bill={bill}
									currency={currency}
									status={statusMap[bill.id] || 'upcoming'}
								/>
							))
						) : (
							<tr>
								<td colSpan={3} className="text-center py-16">
									<p className="font-preset-3 text-grey-500 mb-2">
										{search
											? 'No bills match your search'
											: 'No recurring bills yet'}
									</p>
									<p className="font-preset-5 text-grey-400">
										{search
											? 'Try a different search term.'
											: 'Mark a transaction as recurring to see it here.'}
									</p>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
