import { cn, formatBalance } from '@/lib/utils';
import {
	Dropdown,
	DropdownTrigger,
	DropdownContent,
	DropdownItem,
} from '@/components/ui/dropdown';
import { AccountSelectorProps } from '../layout/global-add-button';

export function AccountDropdown({
	accounts,
	value,
	onChange,
	currency,
}: {
	accounts: AccountSelectorProps[];
	value: string;
	onChange: (value: string) => void;
	currency?: string;
}) {
	const safeAccounts =
		accounts && accounts.length > 0
			? accounts
			: [{ id: 'cash', name: 'Cash', icon: 'wallet', balance: 0 }];

	const selectedAccount =
		safeAccounts.find((a) => a.id === value) || safeAccounts[0];

	return (
		<Dropdown value={value} onValueChange={onChange} className="w-full">
			<DropdownTrigger className="h-11 bg-grey-50 border-grey-200 hover:bg-white w-full px-3">
				<div className="flex items-center justify-between gap-4 w-full">
					<div className="flex items-center gap-2 overflow-hidden">
						<i
							className={cn(
								'ti ti-' + (selectedAccount.icon || 'wallet'),
								'text-lg text-grey-400 shrink-0'
							)}
						/>
						<span className="text-sm font-medium text-grey-900 truncate">
							{selectedAccount.name || 'Select Account'}
						</span>
					</div>
					<span
						className={cn(
							'text-xs font-semibold shrink-0',
							formatBalance(selectedAccount.balance, currency)
								.colorClass
						)}
					>
						{formatBalance(selectedAccount.balance, currency).text}
					</span>
				</div>
			</DropdownTrigger>
			<DropdownContent>
				{safeAccounts.map((acc) => {
					const bal = formatBalance(acc.balance, currency);
					return (
						<DropdownItem key={acc.id} value={acc.id}>
							<div className="flex items-center justify-between gap-4 w-full">
								<div className="flex items-center gap-2 overflow-hidden">
									<i
										className={cn(
											'ti ti-' + acc.icon,
											'text-lg text-grey-400 shrink-0'
										)}
									/>
									<span className="truncate font-medium">
										{acc.name}
									</span>
								</div>
								<span
									className={cn(
										'text-xs font-semibold shrink-0',
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
