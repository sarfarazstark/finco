'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function Input({
	type,
	id,
	name,
	placeholder,
	autoComplete,
	label,
	error,
	className,
	...props
}: {
	type: React.HTMLInputTypeAttribute;
	id: string;
	name: string;
	placeholder?: string;
	label?: string;
	error?: string;
	autoComplete?: React.HTMLInputAutoCompleteAttribute;
	className?: string;
}) {
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === 'password';

	return (
		<div className='flex flex-col gap-2'>
			<div className='flex justify-between'>
				{label && (
					<label
						className={cn(
							'text-grey-900 font-semibold text-xs',
							error && 'text-red',
						)}
						htmlFor={id}>
						{label}
					</label>
				)}
				{error && <p className='text-red text-sm'>{error}</p>}
			</div>

			<div className='relative'>
				<input
					type={isPassword && showPassword ? 'text' : type}
					id={id}
					name={name}
					placeholder={placeholder}
					autoComplete={autoComplete}
					className={cn(
						'w-full px-4 py-2 border border-grey-500 focus-visible:outline-none focus-visible:border-grey-900 rounded-md pr-10',
						error && 'border-red',
						className,
					)}
					{...props}
				/>

				{isPassword && (
					<button
						type='button'
						onClick={() => setShowPassword((v) => !v)}
						className='absolute right-3 top-1/2 -translate-y-1/2 text-grey-600 hover:text-grey-900 transition-all duration-200 active:scale-90'>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</button>
				)}
			</div>
		</div>
	);
}
