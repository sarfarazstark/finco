'use client';

import * as React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from './dialog';
import { Button } from './button';

interface ConfirmDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	variant?: 'primary' | 'destroy';
	isPending?: boolean;
}

export function ConfirmDialog({
	isOpen,
	onOpenChange,
	title,
	description,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	onConfirm,
	variant = 'primary',
	isPending = false,
}: ConfirmDialogProps) {
	const handleConfirm = (e: React.MouseEvent) => {
		e.preventDefault();
		onConfirm();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-[400px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && (
						<DialogDescription>{description}</DialogDescription>
					)}
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="secondary"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						{cancelText}
					</Button>
					<Button
						variant={variant}
						onClick={handleConfirm}
						disabled={isPending}
					>
						{isPending ? 'Processing...' : confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
