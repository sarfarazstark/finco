import Image from 'next/image';
import type { FinancialAccount, Transaction, Icon } from '@prisma/client';

export type TransactionWithRelations = Transaction & {
	category: { name: string; icon: Icon } | null;
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
			className='rounded-full object-cover w-10 h-10'
		/>
	) : (
		<i
				className={`ti ti-${transaction.category?.icon.name} ${transaction.category?.icon.color} text-white text-xl items-center w-10 h-10 rounded-full flex align-center justify-center`}
		></i>
	);
};
