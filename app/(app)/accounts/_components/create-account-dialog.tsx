'use client';

import { useState, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { createAccount } from '@/actions/accounts';
import { IconPlus, IconPhoto } from '@tabler/icons-react';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const formSchema = z.object({
	name: z.string().min(1, 'Account name is required').max(50),
});

export function CreateAccountDialog() {
	const [isPending, startTransition] = useTransition();
	const [preview, setPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > MAX_FILE_SIZE) {
			toast.error('Image must be less than 2MB');
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	function onSubmit(values: z.infer<typeof formSchema>) {
		startTransition(async () => {
			const result = await createAccount({
				name: values.name,
				image: preview || '/assets/images/avatars/default.jpg',
			});

			if (result.success) {
				toast.success('Account created');
				form.reset();
				setPreview(null);
			} else {
				toast.error(result.error || 'Failed to create account');
			}
		});
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="flex items-center gap-2 px-4 py-2.5 bg-grey-900 text-white rounded-lg hover:bg-grey-800 transition-colors font-bold text-sm cursor-pointer">
					<IconPlus className="w-4 h-4" />
					Add Account
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-106.25">
				<DialogHeader>
					<DialogTitle>Create New Account</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div className="flex flex-col items-center gap-3">
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-grey-200 hover:border-grey-400 transition-colors cursor-pointer flex items-center justify-center bg-grey-50 group"
						>
							{preview ? (
								<Image
									src={preview}
									alt="Account image"
									width={80}
									height={80}
									className="w-full h-full object-cover"
								/>
							) : (
								<IconPhoto className="w-7 h-7 text-grey-300 group-hover:text-grey-500 transition-colors" />
							)}
						</button>
						<p className="text-xs text-grey-400">
							Click to upload image
						</p>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
						/>
					</div>

					<div>
						<p className="text-xs font-bold text-grey-500 font-preset-5 mb-2">
							Account Name
						</p>
						<Input
							type="text"
							placeholder="e.g. Main Bank Account"
							{...form.register('name')}
						/>
						{form.formState.errors.name && (
							<p className="text-sm font-medium text-red-500 mt-2">
								{form.formState.errors.name.message}
							</p>
						)}
					</div>

					<div className="flex justify-end pt-2">
						<Button
							type="submit"
							disabled={isPending}
							variant="primary"
							className="w-full"
						>
							{isPending ? 'Creating...' : 'Create Account'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
