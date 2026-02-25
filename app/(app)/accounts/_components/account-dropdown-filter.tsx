'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { AccountWithBalance } from '@/lib/data/accounts';
import {
	Dropdown,
	DropdownTrigger,
	DropdownValue,
	DropdownContent,
	DropdownItem,
} from '@/components/ui/dropdown';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { IconWallet } from '@tabler/icons-react';

export function AccountDropdownFilter({
	accounts,
	selectedAccountId,
	currency,
}: {
	accounts: AccountWithBalance[];
	selectedAccountId: string;
	currency: string;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleSelect = (accountId: string) => {
		const params = new URLSearchParams(searchParams.toString());

		if (accountId === 'all') {
			params.delete('accountId');
		} else {
			params.set('accountId', accountId);
		}

		params.delete('page');
		router.push(`/accounts?${params.toString()}`);
	};

	// We use "all" to represent when no specific account is selected.
	const currentValue = selectedAccountId || 'all';

	return (
		<Dropdown value={currentValue} onValueChange={handleSelect}>
			<DropdownTrigger className="w-48 h-auto py-1.5 px-2 focus:ring-0 border-grey-200 rounded-full bg-transparent hover:bg-grey-50 transition-colors">
				<DropdownValue placeholder="All Accounts">
					{(value) => {
						if (!value || value === 'all') {
							return (
								<div className="flex items-center gap-3">
									<div className="w-6 h-6 rounded-full bg-grey-100 flex items-center justify-center shrink-0 border border-grey-200">
										<IconWallet className="w-3 h-3 text-grey-500" />
									</div>
									<span className="font-preset-4 text-grey-900 truncate">All Accounts</span>
								</div>
							);
						}

						const account = accounts.find(a => a.id === value);
						if (!account) return 'All Accounts';

						return (
							<div className="flex items-center gap-3 w-full min-w-0 pr-2">
								<div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-grey-200">
									<Image
										src={account.image || '/assets/images/avatars/default.jpg'}
										alt={account.name}
										width={24}
										height={24}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="flex flex-col items-start min-w-0 flex-1">
									<span className="font-preset-5 font-bold text-grey-900 truncate w-full text-left leading-tight">
										{account.name}
									</span>
									<span className="font-preset-5 text-grey-500 truncate w-full text-left leading-tight mt-0.5">
										{formatCurrency(account.balance, currency)}
									</span>
								</div>
							</div>
						);
					}}
				</DropdownValue>
			</DropdownTrigger>
			<DropdownContent className="w-48">
				<DropdownItem value="all" className="py-2.5">
					<div className="flex items-center gap-3">
						<div className="w-6 h-6 rounded-full bg-grey-100 flex items-center justify-center shrink-0 border border-grey-200">
							<IconWallet className="w-3 h-3 text-grey-500" />
						</div>
						<span className="font-preset-4 text-grey-900 truncate">All Accounts</span>
					</div>
				</DropdownItem>
				{accounts.map(account => (
					<DropdownItem key={account.id} value={account.id} className="py-2.5">
						<div className="flex items-center gap-3 w-full min-w-0">
							<div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-grey-200">
								<Image
									src={account.image || '/assets/images/avatars/default.jpg'}
									alt={account.name}
									width={24}
									height={24}
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="flex flex-col items-start min-w-0 flex-1">
								<span className="font-preset-5 font-bold text-grey-900 truncate w-full text-left leading-tight">
									{account.name}
								</span>
								<span className="font-preset-5 text-grey-500 truncate w-full text-left leading-tight mt-0.5">
									{formatCurrency(account.balance, currency)}
								</span>
							</div>
						</div>
					</DropdownItem>
				))}
			</DropdownContent>
		</Dropdown>
	);
}
