'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import dynamic from 'next/dynamic';

const IncomeDialog = dynamic(
	() => import('../transactions/income-dialog').then(mod => mod.IncomeDialog),
	{ ssr: false }
);
const ExpenseDialog = dynamic(
	() =>
		import('../transactions/expense-dialog').then(mod => mod.ExpenseDialog),
	{ ssr: false }
);
const TransferDialog = dynamic(
	() =>
		import('../transactions/transfer-dialog').then(
			mod => mod.TransferDialog
		),
	{ ssr: false }
);

const OPTIONS = [
	{
		id: 'INCOME',
		label: 'Add Income',
		icon: 'arrow-down-left',
		iconColor: 'text-green',
		iconBg: 'bg-green/10',
	},
	{
		id: 'EXPENSE',
		label: 'Add Expense',
		icon: 'arrow-up-right',
		iconColor: 'text-red-600',
		iconBg: 'bg-red-50',
	},
	{
		id: 'TRANSFER',
		label: 'Transfer',
		icon: 'arrows-right-left',
		iconColor: 'text-gray-900',
		iconBg: 'bg-gray-900/10',
	},
] as const;

export default function GlobalAddButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [activeDialog, setActiveDialog] = useState<
		'INCOME' | 'EXPENSE' | 'TRANSFER' | null
	>(null);

	return (
		<>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-40"
						onClick={() => setIsOpen(false)}
					/>
				)}
			</AnimatePresence>

			<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-5">
				<AnimatePresence>
					{isOpen && (
						<motion.div
							className="flex flex-col gap-3"
							initial="hidden"
							animate="visible"
							exit="hidden"
							variants={{
								visible: {
									opacity: 1,
									transition: {
										staggerChildren: 0.05,
										delayChildren: 0.05,
									},
								},
								hidden: {
									opacity: 0,
									transition: {
										staggerChildren: 0.05,
										staggerDirection: -1,
									},
								},
							}}
						>
							{OPTIONS.map(
								({ id, label, icon, iconColor, iconBg }) => (
									<motion.button
										key={id}
										variants={{
											visible: {
												opacity: 1,
												y: 0,
												scale: 1,
												transition: {
													type: 'spring',
													stiffness: 400,
													damping: 25,
												},
											},
											hidden: {
												opacity: 0,
												y: 10,
												scale: 0.95,
												transition: { duration: 0.15 },
											},
										}}
										onClick={() => {
											setActiveDialog(
												id as
													| 'INCOME'
													| 'EXPENSE'
													| 'TRANSFER'
													| null
											);
											setIsOpen(false);
										}}
										className="flex items-center justify-between gap-3 pr-2 pl-4 py-2 bg-white rounded-full shadow-xl border border-grey-100 hover:scale-[1.03] hover:bg-grey-50 transition-all cursor-pointer"
									>
										<span className="font-preset-4-bold text-sm text-grey-900 drop-shadow-sm">
											{label}
										</span>
										<div
											className={cn(
												'w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-black/5',
												iconBg,
												iconColor
											)}
										>
											<i
												className={cn(
													'ti ti-' + icon,
													'text-lg'
												)}
											/>
										</div>
									</motion.button>
								)
							)}
						</motion.div>
					)}
				</AnimatePresence>

				<motion.button
					onClick={() => setIsOpen(prev => !prev)}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					animate={{ rotate: isOpen ? 135 : 0 }}
					transition={{ type: 'spring', stiffness: 300, damping: 20 }}
					className="w-12 h-12 bg-grey-900 text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer relative z-50 outline-none"
				>
					<IconPlus className="w-7 h-7" />
				</motion.button>
			</div>

			<IncomeDialog
				open={activeDialog === 'INCOME'}
				onOpenChange={open => !open && setActiveDialog(null)}
			/>
			<ExpenseDialog
				open={activeDialog === 'EXPENSE'}
				onOpenChange={open => !open && setActiveDialog(null)}
			/>
			<TransferDialog
				open={activeDialog === 'TRANSFER'}
				onOpenChange={open => !open && setActiveDialog(null)}
			/>
		</>
	);
}
