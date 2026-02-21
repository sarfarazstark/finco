import Image from 'next/image';
import type { FinancialAccount, Transaction, Icon } from '@prisma/client';

export type TransactionWithRelations = Transaction & {
	category: { icon: Icon } | null;
	account: FinancialAccount | null;
};

export const ResolvedImage = ({
	transaction,
}: {
	transaction: TransactionWithRelations;
}) => {
	return transaction.type === 'TRANSFER' ? (
		<Image
			src={
				transaction.account?.image ??
				'/assets/images/default-avatar.png'
			}
			alt={transaction.account?.name ?? 'Transfer'}
			width={40}
			height={40}
		/>
	) : (
		<i
			className={`ti ti-${transaction.category?.icon.name} ${transaction.category?.icon.bg} ${transaction.category?.icon.color} text-2xl flex items-center justify-center w-full h-full`}
		></i>
	);
};
