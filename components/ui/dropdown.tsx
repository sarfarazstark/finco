'use client';

/*
 * Dropdown — a composable, accessible dropdown component.
 * Uses a custom 'dropdown:open' DOM event to close sibling dropdowns
 * whenever a new one is opened, ensuring only one is open at a time.
 * Each Dropdown instance is identified by a stable ref-based ID.
 */

import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useEffect,
	useLayoutEffect,
	useCallback,
	useId,
} from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/hooks/use-click-outside';

const DROPDOWN_OPEN_EVENT = 'dropdown:open';

interface DropdownContextType {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	value: string | undefined;
	onSelect: (value: string) => void;
	labels: Record<string, string>;
	registerLabel: (value: string, label: string) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(
	undefined
);

const useDropdown = () => {
	const context = useContext(DropdownContext);
	if (!context) {
		throw new Error('useDropdown must be used within a Dropdown component');
	}
	return context;
};

export const Dropdown = ({
	children,
	value: externalValue,
	defaultValue,
	onValueChange,
	className,
}: {
	children: React.ReactNode;
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	className?: string;
}) => {
	const id = useId();
	const [isOpen, setIsOpen] = useState(false);
	const [internalValue, setInternalValue] = useState<string | undefined>(
		defaultValue
	);
	const [labels, setLabels] = useState<Record<string, string>>({});

	const value = externalValue !== undefined ? externalValue : internalValue;

	const handleSelect = (newValue: string) => {
		setInternalValue(newValue);
		onValueChange?.(newValue);
		setIsOpen(false);
	};

	const registerLabel = useCallback((val: string, label: string) => {
		setLabels(prev => {
			if (prev[val] === label) return prev;
			return { ...prev, [val]: label };
		});
	}, []);

	const dropdownRef = useRef<HTMLDivElement>(null);
	useClickOutside(dropdownRef, () => setIsOpen(false));

	useEffect(() => {
		const handleOtherOpen = (e: Event) => {
			const event = e as CustomEvent<{ id: string }>;
			if (event.detail.id !== id) {
				setIsOpen(false);
			}
		};
		document.addEventListener(DROPDOWN_OPEN_EVENT, handleOtherOpen);
		return () =>
			document.removeEventListener(DROPDOWN_OPEN_EVENT, handleOtherOpen);
	}, [id]);

	const handleOpen = useCallback(
		(next: boolean | ((prev: boolean) => boolean)) => {
			setIsOpen(prev => {
				const nextValue =
					typeof next === 'function' ? next(prev) : next;
				if (nextValue) {
					document.dispatchEvent(
						new CustomEvent(DROPDOWN_OPEN_EVENT, { detail: { id } })
					);
				}
				return nextValue;
			});
		},
		[id]
	);

	return (
		<DropdownContext.Provider
			value={{
				isOpen,
				setIsOpen: handleOpen,
				value,
				onSelect: handleSelect,
				labels,
				registerLabel,
			}}
		>
			<div
				ref={dropdownRef}
				className={cn('relative inline-block', className)}
			>
				{children}
			</div>
		</DropdownContext.Provider>
	);
};

export const DropdownTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<'button'>
>(({ className, children, ...props }, ref) => {
	const { isOpen, setIsOpen } = useDropdown();

	return (
		<button
			ref={ref}
			type="button"
			onClick={() => setIsOpen(prev => !prev)}
			className={cn(
				'flex w-full items-center justify-between rounded-lg border border-grey-500/50 bg-white px-3 py-2 text-sm text-grey-900 transition-colors',
				'focus:border-grey-900 focus:outline-none focus:ring-1 focus:ring-grey-900',
				isOpen && 'border-grey-900 ring-1 ring-grey-900',
				className
			)}
			{...props}
		>
			{children}
			<IconChevronDown
				className={cn(
					'h-4 w-4 ml-2 shrink-0 text-grey-500 transition-transform duration-200',
					isOpen && 'rotate-180 text-grey-900'
				)}
				aria-hidden="true"
			/>
		</button>
	);
});
DropdownTrigger.displayName = 'DropdownTrigger';

export const DropdownValue = ({
	placeholder,
	children,
	className,
}: {
	placeholder?: string;
	children?:
		| React.ReactNode
		| ((value: string | undefined) => React.ReactNode);
	className?: string;
}) => {
	const { value, labels } = useDropdown();

	const displayValue = value && labels[value] ? labels[value] : placeholder;

	return (
		<span
			className={cn(
				'block truncate capitalize',
				!value && 'text-grey-500',
				className
			)}
		>
			{typeof children === 'function'
				? children(value)
				: (children ?? displayValue)}
		</span>
	);
};

export const DropdownContent = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	const { isOpen } = useDropdown();
	const contentRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState<{
		direction: 'down' | 'up';
		alignment: 'left' | 'right';
	}>({
		direction: 'down',
		alignment: 'left',
	});

	useLayoutEffect(() => {
		if (isOpen && contentRef.current) {
			const triggerEl = contentRef.current.parentElement;
			if (!triggerEl) return;

			const rect = triggerEl.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const viewportWidth = window.innerWidth;
			const assumedHeight = 250;
			const assumedWidth = 200;
			const spaceBelow = viewportHeight - rect.bottom;
			const spaceAbove = rect.top;

			let direction: 'down' | 'up' = 'down';
			if (spaceBelow < assumedHeight && spaceAbove > spaceBelow) {
				direction = 'up';
			}

			let alignment: 'left' | 'right' = 'left';
			if (rect.left + assumedWidth > viewportWidth) {
				alignment = 'right';
			}

			setPosition({ direction, alignment });
		}
	}, [isOpen]);

	return (
		<motion.div
			ref={contentRef}
			initial={false}
			animate={
				isOpen
					? { opacity: 1, y: 0, display: 'block' }
					: {
							opacity: 0,
							y: position.direction === 'down' ? -10 : 10,
							transitionEnd: { display: 'none' },
						}
			}
			transition={{ duration: 0.15, ease: 'easeOut' }}
			className={cn(
				'absolute min-w-[200px] w-full bg-white border border-grey-500/30 rounded-lg shadow-custom z-100 overflow-hidden',
				position.direction === 'down'
					? 'top-[calc(100%+8px)]'
					: 'bottom-[calc(100%+8px)]',
				position.alignment === 'left' ? 'left-0' : 'right-0',
				className
			)}
			style={{
				originY: position.direction === 'down' ? 0 : 1,
				display: isOpen ? 'block' : undefined,
				pointerEvents: isOpen ? 'auto' : 'none',
			}}
		>
			<div className="max-h-60 overflow-y-auto">{children}</div>
		</motion.div>
	);
};

export const DropdownItem = ({
	value,
	children,
	className,
}: {
	value: string;
	children: React.ReactNode;
	className?: string;
}) => {
	const { value: selectedValue, onSelect, registerLabel } = useDropdown();
	const itemRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (itemRef.current) {
			registerLabel(value, itemRef.current.textContent?.trim() || value);
		}
	}, [value, registerLabel, children]);

	return (
		<button
			ref={itemRef}
			type="button"
			onClick={() => onSelect(value)}
			className={cn(
				'w-full flex items-center px-4 py-2 text-sm text-left transition-colors',
				'hover:bg-grey-100 hover:text-grey-900',
				selectedValue === value
					? 'bg-grey-100 font-bold text-grey-900'
					: 'text-grey-500',
				className
			)}
		>
			{children}
		</button>
	);
};
