'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function ForgotPassword() {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			toast.error('Please enter your email');
			return;
		}

		try {
			setLoading(true);
			const { error } = await authClient.requestPasswordReset({
				email,
				redirectTo: '/auth/reset-password',
			});

			if (error) {
				console.error('[FORGOT_PASSWORD_ERROR]', error);
				toast.error(error.message || 'Something went wrong. Please try again.');
				setLoading(false);
				return;
			}

			setSubmitted(true);
		} catch {
			toast.error('An unexpected error occurred. Please try again.');
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
				className="min-w-[400px] max-w-md w-full bg-white p-8 rounded-lg flex flex-col gap-5 mx-4"
			>
				<div>
					<h3 className="font-bold text-grey-900 font-preset-1 mb-2">
						Reset Password
					</h3>
					<p className="text-grey-500 text-sm">
						{submitted
							? "If an account exists, we've sent a link to reset your password."
							: "Enter your email address and we'll send you a link to reset your password."}
					</p>
				</div>

				{!submitted ? (
					<form onSubmit={handleSubmit} className="flex flex-col gap-5">
						<Input
							label="Email Address"
							type="email"
							id="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="email"
						/>
						<Button type="submit">
							{loading ? 'Sending...' : 'Send Reset Link'}
						</Button>
					</form>
				) : (
					<Button className="mt-4" onClick={() => setSubmitted(false)} variant="secondary">
						Try another email
					</Button>
				)}

				<div className="text-center mt-2">
					<Link
						href="/auth/login"
						className="text-grey-500 text-sm hover:text-grey-900 underline underline-offset-4"
					>
						Back to Login
					</Link>
				</div>
			</motion.div>
		</div>
	);
}
