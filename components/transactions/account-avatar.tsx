import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AccountAvatarProps {
	url?: string;
	name?: string;
	className?: string;
	width?: number;
	height?: number;
}

export function AccountAvatar({ url = '/assets/images/avatars/default.jpg', name, className, width, height }: AccountAvatarProps) {

	return (
		<div className="flex items-center gap-2 overflow-hidden">
			<Image
				width={width || 20}
				height={height || 20}
				src={url}
				alt={name || ""}
				className={cn('rounded-full object-cover shrink-0', className)}
			/>
			{name && (
				<span className="text-xs font-medium truncate text-grey-900">
					{name}
				</span>
			)}
		</div>
	);
}
