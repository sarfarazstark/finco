import * as React from 'react';
import { cn } from '@/lib/utils';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
	orientation?: 'vertical' | 'horizontal' | 'both';
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
	({ className, children, orientation = 'vertical', ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					'relative overflow-hidden',
					orientation === 'vertical' && 'overflow-y-auto',
					orientation === 'horizontal' && 'overflow-x-auto',
					orientation === 'both' && 'overflow-auto',
					'custom-scrollbar',
					className
				)}
				{...props}
			>
				{children}
			</div>
		);
	}
);

ScrollArea.displayName = 'ScrollArea';
