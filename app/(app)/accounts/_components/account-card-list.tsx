'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn, formatCurrency } from '@/lib/utils';
import { AccountWithBalance } from '@/lib/data/accounts';

export function AccountCardList({
	accounts,
	currency,
	selectedAccountId,
}: {
	accounts: AccountWithBalance[];
	currency: string;
	selectedAccountId: string;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleSelect = (accountId: string) => {
		const params = new URLSearchParams(searchParams.toString());

		if (selectedAccountId === accountId) {
			params.delete('accountId');
		} else {
			params.set('accountId', accountId);
		}

		params.delete('page');
		router.push(`/accounts?${params.toString()}`);
	};

	if (accounts.length === 0) {
		return (
			<div className="text-center py-10 bg-white rounded-xl border border-grey-100">
				<p className="font-preset-3 text-grey-500 mb-2">
					No accounts yet
				</p>
				<p className="font-preset-5 text-grey-400">
					Create your first account to start tracking.
				</p>
			</div>
		);
	}

	return (
		<div className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
			{accounts.map(account => {
				const isSelected = selectedAccountId === account.id;

				return (
					<button
						key={account.id}
						onClick={() => handleSelect(account.id)}
						className={cn(
							'flex items-center gap-3 p-5 rounded-xl border transition-colors cursor-pointer text-left shrink-0 w-48 snap-center bg-white text-grey-900',
							isSelected ? 'border-grey-900' : 'border-grey-100'
						)}
					>
						<div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
							<Image
								src={
									account.image ||
									'/assets/images/avatars/default.jpg'
								}
								alt={account.name}
								width={36}
								height={36}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="min-w-0">
							<p className="font-preset-4 truncate">
								{account.name}
							</p>
							<p className={cn('font-preset-4-bold truncate')}>
								{formatCurrency(account.balance, currency)}
							</p>
						</div>
					</button>
				);
			})}
		</div>
	);
}
