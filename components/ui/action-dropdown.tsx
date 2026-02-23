'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { cn } from '@/lib/utils';

export interface ActionItem {
	label: string;
	icon?: string; // Tabler icon name
	onClick: () => void;
	className?: string;
	disabled?: boolean;
}

export interface ActionDropdownProps {
	trigger?: React.ReactNode;
	actions: ActionItem[];
	className?: string; // Container className
	dropdownClassName?: string;
	align?: 'left' | 'right';
}

export function ActionDropdown({
	trigger,
	actions,
	className,
	dropdownClassName,
	align = 'right',
}: ActionDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useClickOutside(menuRef, () => setIsOpen(false));

	const handleActionClick = (onClick: () => void) => {
		setIsOpen(false);
		onClick();
	};

	return (
		<div className={cn('relative inline-block', className)} ref={menuRef}>
			<div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
				{trigger || (
					<button
						type="button"
						className="w-8 h-8 rounded-full flex items-center justify-center text-grey-500 hover:text-grey-900 hover:bg-grey-100 transition-colors focus:outline-none"
					>
						<i className="ti ti-dots-vertical text-lg" />
					</button>
				)}
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -10 }}
						transition={{ duration: 0.15, ease: 'easeOut' }}
						className={cn(
							'absolute mt-1 z-50 w-36 bg-white border border-grey-200 rounded-lg shadow-custom overflow-hidden',
							align === 'right' ? 'right-0' : 'left-0',
							dropdownClassName
						)}
					>
						{actions.map((action, index) => (
							<button
								key={index}
								type="button"
								onClick={() => handleActionClick(action.onClick)}
								disabled={action.disabled}
								className={cn(
									'w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
									action.className ||
										'text-grey-700 hover:bg-grey-50 hover:text-grey-900'
								)}
							>
								{action.icon && (
									<i
										className={cn(
											'ti ti-' + action.icon,
											'text-lg'
										)}
									/>
								)}
								<span>{action.label}</span>
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
