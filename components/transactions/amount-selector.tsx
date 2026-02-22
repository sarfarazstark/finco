import { cn } from '@/lib/utils';
import { Category } from './category-dialog';
import { forwardRef } from 'react';

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
						'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all hover:scale-105 group bg-white',
						categoryId ? categoryId.color : 'text-grey-500'
					)}
					title="Select Category"
				>
					<i
						className={cn(
							'text-2xl',
							categoryId
								? `ti ti-${categoryId.icon}`
								: 'ti ti-category'
						)}
					/>
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
						onChange={(e) => onAmountChange(e.target.value)}
						className="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-grey-900 w-full placeholder:text-grey-300 p-0 leading-none h-8 flex items-center"
					/>
				</div>
			</div>
		);
	}
);
