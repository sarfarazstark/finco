'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/hooks/use-click-outside';

interface DialogContextProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogContext = React.createContext<DialogContextProps | undefined>(
	undefined
);

export const useDialog = () => {
	const context = React.useContext(DialogContext);
	if (!context) throw new Error('useDialog must be used within a <Dialog />');
	return context;
};

export const Dialog = ({
	children,
	open,
	onOpenChange,
	defaultOpen = false,
}: {
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	defaultOpen?: boolean;
}) => {
	const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

	const isOpen = open !== undefined ? open : internalOpen;

	const setIsOpen = React.useCallback(
		(value: boolean | ((prevState: boolean) => boolean)) => {
			const newValue =
				typeof value === 'function' ? value(isOpen) : value;
			if (open === undefined) {
				setInternalOpen(newValue);
			}
			onOpenChange?.(newValue);
		},
		[isOpen, open, onOpenChange]
	);

	return (
		<DialogContext.Provider value={{ isOpen, setIsOpen }}>
			{children}
		</DialogContext.Provider>
	);
};

export const DialogTrigger = ({
	children,
	asChild,
}: {
	children: React.ReactElement<{ onClick?: React.MouseEventHandler }>;
	asChild?: boolean;
}) => {
	const { setIsOpen } = useDialog();

	if (asChild && React.isValidElement(children)) {
		return React.cloneElement(children, {
			onClick: (e: React.MouseEvent) => {
				children.props.onClick?.(e);
				setIsOpen(true);
			},
		} as React.HTMLAttributes<HTMLElement>);
	}

	return (
		<span
			onClick={() => setIsOpen(true)}
			className="cursor-pointer inline-flex"
		>
			{children}
		</span>
	);
};

export const DialogContent = ({
	children,
	className,
	hideClose = false,
}: {
	children: React.ReactNode;
	className?: string;
	hideClose?: boolean;
}) => {
	const { isOpen, setIsOpen } = useDialog();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	// Lock body scroll when open
	React.useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	// Escape key to close
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) setIsOpen(false);
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, setIsOpen]);

	const contentRef = React.useRef<HTMLDivElement>(null);
	useClickOutside(contentRef, () => setIsOpen(false));

	if (!mounted) return null;

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
						aria-hidden="true"
					/>

					<motion.div
						ref={contentRef}
						initial={{ opacity: 0, scale: 0.95, y: -20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -20 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className={cn(
							'bg-white rounded-xl shadow-lg border border-grey-100 p-6 md:p-8 w-full max-w-lg mx-4 z-50 relative focus:outline-none',
							className
						)}
						role="dialog"
						aria-modal="true"
					>
						{!hideClose && (
							<button
								onClick={() => setIsOpen(false)}
								className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-grey-900 focus:ring-offset-2 disabled:pointer-events-none"
							>
								<IconX className="h-5 w-5 text-grey-500 hover:text-grey-900 transition-colors" />
								<span className="sr-only">Close</span>
							</button>
						)}
						{children}
					</motion.div>
				</div>
			)}
		</AnimatePresence>,
		document.body
	);
};

export const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			'flex flex-col space-y-1.5 text-center sm:text-left mb-6',
			className
		)}
		{...props}
	/>
);

export const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 mt-8',
			className
		)}
		{...props}
	/>
);

export const DialogTitle = ({
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
	<h2
		className={cn('text-2xl font-preset-1 tracking-tight', className)}
		{...props}
	/>
);

export const DialogDescription = ({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
	<p className={cn('text-sm text-grey-500', className)} {...props} />
);
