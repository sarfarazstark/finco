'use client';

import React, { useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cn, formatBalance } from '@/lib/utils';
import {
	Dropdown,
	DropdownTrigger,
	DropdownContent,
	DropdownItem,
} from '@/components/ui/dropdown';
import { AccountAvatar } from '@/components/transactions/account-avatar';

export function AccountFilter({
	accounts,
	currency,
}: {
	accounts: { id: string; name: string; icon: string; balance: number }[];
	currency?: string;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [, startTransition] = useTransition();

	const defaultAccountId = searchParams.get('accountId') || 'All';

	const safeAccounts =
		accounts && accounts.length > 0
			? accounts
			: [];

	const selectedAccount =
		safeAccounts.find((a) => a.id === defaultAccountId);

	const updateFilter = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value === 'All' || !value) {
			params.delete('accountId');
		} else {
			params.set('accountId', value);
		}
		params.delete('page');
		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	};

	return (
		<Dropdown value={defaultAccountId} onValueChange={updateFilter}>
			<DropdownTrigger className="h-10 border border-grey-200 bg-white hover:bg-grey-50 px-3 rounded-lg min-w-[200px]">
				<div className="flex items-center gap-3 w-full">
					{selectedAccount ? (
						<>
							<AccountAvatar
								url={selectedAccount.icon}
								name={selectedAccount.name}
								className="w-5 h-5"
							/>
							<span
								className={cn(
									'text-xs font-semibold shrink-0 ml-auto leading-none',
									formatBalance(selectedAccount.balance, currency).colorClass
								)}
							>
								{formatBalance(selectedAccount.balance, currency).text}
							</span>
						</>
					) : (
						<span className="text-sm font-medium text-grey-500 w-full text-left">
							All Accounts
						</span>
					)}
				</div>
			</DropdownTrigger>
			<DropdownContent>
				<DropdownItem value="All">
					<span className="font-medium">All Accounts</span>
				</DropdownItem>
				{safeAccounts.map((acc) => {
					const bal = formatBalance(acc.balance, currency);
					return (
						<DropdownItem key={acc.id} value={acc.id}>
							<div className="flex items-center justify-between gap-4 w-full">
								<AccountAvatar
									url={acc.icon}
									name={acc.name}
									className="w-5 h-5"
								/>
								<span
									className={cn(
										'text-xs font-semibold shrink-0 leading-none',
										bal.colorClass
									)}
								>
									{bal.text}
								</span>
							</div>
						</DropdownItem>
					);
				})}
			</DropdownContent>
		</Dropdown>
	);
}
