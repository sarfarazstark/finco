'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'motion/react';
import { login_schema } from '@/lib/schema';
import { useZodForm } from '@/hooks/use-zod-form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { authClient } from '@/lib/auth-client';

export default function Login() {
	const [loading, setLoading] = useState(false);
	const { errors, parse } = useZodForm(login_schema);
	const router = useRouter();

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const data = parse(formData);
		if (!data) return;
		try {
			setLoading(true);
			const { error } = await authClient.signIn.email({
				email: data.email,
				password: data.password,
			});

			if (error) {
				if (
					error.code === 'EMAIL_NOT_VERIFIED' ||
					error.message?.toLowerCase().includes('verif')
				) {
					toast.error('Please verify your email to login.');
					router.push(
						`/auth/verify?email=${encodeURIComponent(data.email)}`
					);
					setLoading(false);
					return;
				}

				toast.error('Incorrect email or password. Please try again.');
				setLoading(false);
				return;
			}

			toast.success('Welcome back!');
			router.push('/');
			setLoading(false);
		} catch {
			toast.error('Something went wrong on our end. Please try again.');
			setLoading(false);
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
				<h3 className="font-bold text-grey-900 font-preset-1">Login</h3>
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
					<div className="flex flex-col gap-2">
						<Button type="submit">
							{loading ? 'Logging in...' : 'Login'}
						</Button>
						<div className="text-center mt-2">
							<Link
								href="/auth/forgot-password"
								className="text-grey-500 text-sm hover:text-grey-900 underline underline-offset-4"
							>
								Forgot your password?
							</Link>
						</div>
					</div>
				</form>
				<div className="text-center text-grey-500">
					Need to create an account?{' '}
					<Link
						href="/auth/signup"
						className="text-grey-900 underline ml-1"
					>
						Sign up
					</Link>
				</div>
			</motion.div>
		</div>
	);
}
