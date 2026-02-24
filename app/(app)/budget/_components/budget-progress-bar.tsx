interface BudgetProgressBarProps {
	spent: number;
	maximum: number;
	themeColor: string;
	budgetId: string;
}

export function BudgetProgressBar({
	spent,
	maximum,
	themeColor,
	budgetId,
}: BudgetProgressBarProps) {
	const absoluteSpent = Math.abs(spent);
	const isOverspent = absoluteSpent > maximum;

	const mainWidth = isOverspent
		? `${(maximum / absoluteSpent) * 100}%`
		: `${Math.min((absoluteSpent / (maximum || 1)) * 100, 100)}%`;
	const overspentWidth = isOverspent
		? `${((absoluteSpent - maximum) / absoluteSpent) * 100}%`
		: '0%';

	return (
		<div className="w-full h-8 bg-[#F8F4F0] rounded p-1 flex">
			<div
				className="h-full rounded-sm transition-all duration-300"
				style={{
					width: mainWidth,
					background: themeColor,
				}}
			></div>

			{isOverspent && (
				<div
					className="h-full rounded-sm ml-1 transition-all duration-300 relative overflow-hidden"
					style={{ width: overspentWidth }}
				>
					<svg
						width="100%"
						height="100%"
						className="absolute inset-0"
					>
						<defs>
							<pattern
								id={`overspent-list-${budgetId}`}
								width="10"
								height="10"
								patternUnits="userSpaceOnUse"
								patternTransform="rotate(130)"
							>
								<rect
									width="10"
									height="10"
									fill="#F8F4F0"
								></rect>
								<line
									x1="0"
									y1="0"
									x2="0"
									y2="10"
									stroke="#C94736"
									strokeWidth="2"
									opacity="0.5"
								></line>
							</pattern>
						</defs>
						<rect
							width="100%"
							height="100%"
							fill={`url(#overspent-list-${budgetId})`}
						></rect>
					</svg>
				</div>
			)}
		</div>
	);
}
