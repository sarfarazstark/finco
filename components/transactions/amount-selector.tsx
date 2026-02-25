import { cn } from '@/lib/utils';
import { Category } from './category-dialog';
import { forwardRef } from 'react';
import { IconCircleDashedPlus } from '@tabler/icons-react';

export interface AmountSelectorProps {
	amount: number | string;
	onAmountChange: (value: string | number) => void;
	categoryId: Category | null;
	onCategoryClick: () => void;
	borderColor: string;
	textColor: string;
	currencySymbol: string;
}

export const AmountSelector = forwardRef<HTMLDivElement, AmountSelectorProps>(
	function AmountSelector(
		{
			amount,
			onAmountChange,
			categoryId,
			onCategoryClick,
			borderColor,
			textColor,
			currencySymbol,
		},
		ref
	) {
		return (
			<div
				ref={ref}
				className={cn(
					'flex items-center gap-3 p-2 bg-grey-50 rounded-xl border',
					borderColor
				)}
			>
				<button
					type="button"
					onClick={onCategoryClick}
					className={cn(
						'w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all hover:scale-105 group bg-white',
						categoryId ? categoryId.color : 'text-grey-500'
					)}
					title="Select Category"
				>
					{categoryId ? (
						<i
							className={cn(
								'text-xl text-white',
								categoryId
									? `ti ti-${categoryId.icon}`
									: 'ti ti-category'
							)}
						/>
					) : (
						<IconCircleDashedPlus className="text-xl text-gray-500" />
					)}
				</button>

				<div className="flex-1 flex items-center gap-1">
					<span
						className={cn(
							'text-2xl font-bold leading-none flex items-center h-8',
							textColor
						)}
					>
						{currencySymbol}
					</span>
					<input
						type="number"
						autoFocus
						placeholder="0.00"
						value={amount}
						min="0"
						step="0.01"
						onChange={e => {
							const val = e.target.value;
							if (
								val === '' ||
								(Number(val) >= 0 && !isNaN(Number(val)))
							) {
								onAmountChange(val);
							}
						}}
						className="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-grey-900 w-full placeholder:text-grey-300 p-0 leading-none h-8 flex items-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					/>
				</div>
			</div>
		);
	}
);
