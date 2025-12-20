import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const baseStyles =
	'inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variantStyles = {
	primary:
		'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950',
	secondary:
		'bg-neutral-50 text-neutral-900 border border-neutral-200 hover:bg-white active:bg-neutral-100',
	tertiary:
		'bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100',
	destroy: 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700',
} as const;

const sizeStyles = {
	sm: 'h-8 px-3 text-sm',
	md: 'h-10 px-4 text-base',
	lg: 'h-12 px-6 text-lg',
} as const;

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: keyof typeof variantStyles;
	size?: keyof typeof sizeStyles;
	full?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, variant = 'primary', size = 'md', full = false, ...props },
		ref,
	) => {
		return (
			<button
				ref={ref}
				className={cn(
					baseStyles,
					variantStyles[variant],
					sizeStyles[size],
					full && 'w-full',
					className,
				)}
				{...props}
			/>
		);
	},
);

Button.displayName = 'Button';
