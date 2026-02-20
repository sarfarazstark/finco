'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'motion/react';
import { signup_schema } from '@/lib/schema';
import { useZodForm } from '@/hooks/use-zod-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function SignUp() {
	const { errors, parse } = useZodForm(signup_schema);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const data = parse(formData);

		if (!data) return;

		try {
			const { error } = await authClient.signUp.email({
				email: data.email,
				password: data.password,
				name: data.name,
				callbackURL: '/?success=signup',
			});

			if (error) {
				toast.error(error.message || 'Sign up failed');
				return;
			}

			toast.success('Sign up successful');
			router.push('/?success=signup');
		} catch {
			toast.error('An unexpected error occurred');
		}
	};

	return (
		<div className="h-full flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, scale: 0.96 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.98 }}
				transition={{ duration: 0.25, ease: 'easeOut' }}
				className="min-w-md bg-white p-8 rounded-lg flex flex-col gap-5"
			>
				<h3 className="font-bold text-grey-900 font-preset-1">
					Sign Up
				</h3>
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<Input
						label="Name"
						type="text"
						id="name"
						name="name"
						error={errors.name}
					/>
					<Input
						label="Email"
						type="email"
						id="email"
						name="email"
						autoComplete="email"
						error={errors.email}
					/>
					<Input
						label="Password"
						type="password"
						id="password"
						name="password"
						autoComplete="off"
						error={errors.password}
					/>
					<Button type="submit">Sign Up</Button>
				</form>
				<div className="text-center text-grey-500">
					Already have an account?{' '}
					<Link
						href="/auth/login"
						className="text-grey-900 underline ml-1"
					>
						Login
					</Link>
				</div>
			</motion.div>
		</div>
	);
}
